import {
  buildDistractorPool,
  buildLevelSession,
  clamp,
  createRng,
  createVisualVariant,
  pick
} from "./balance.js";
import { SoundEngine } from "./sound.js";

const dangerGap = 42;
const pointerEvents = ["pointerdown"];

export class GameEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.callbacks = callbacks;
    this.sound = new SoundEngine();
    this.active = [];
    this.pool = [];
    this.particles = [];
    this.floaters = [];
    this.lanes = [];
    this.animation = 0;
    this.running = false;
    this.paused = false;
    this.width = 1;
    this.height = 1;
    this.dpr = 1;
    this.last = 0;
    this.statsTick = 0;
    this.fpsSamples = [];
    this.pointerHandler = (event) => this.handlePointer(event);
    this.resizeHandler = () => this.resize();
  }

  start(options = {}) {
    this.stop();
    this.session = buildLevelSession(options);
    this.rng = createRng(`${this.session.seed}:engine:${this.session.mode}:${this.session.difficulty}`);
    this.settings = { ...this.session.settings };
    this.stats = createStats(this.session);
    this.waveIndex = -1;
    this.currentWave = null;
    this.spawnAccumulator = 0;
    this.transitionTime = 0.95;
    this.adaptiveFactor = 1;
    this.survivalRamp = 0;
    this.complete = false;
    this.gameOver = false;
    this.resize();
    window.addEventListener("resize", this.resizeHandler);
    pointerEvents.forEach((type) => this.canvas.addEventListener(type, this.pointerHandler, { passive: true }));
    this.running = true;
    this.paused = false;
    this.nextWave();
    this.last = performance.now();
    this.animation = requestAnimationFrame((time) => this.frame(time));
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animation);
    window.removeEventListener("resize", this.resizeHandler);
    pointerEvents.forEach((type) => this.canvas.removeEventListener(type, this.pointerHandler));
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.last = performance.now();
  }

  setMuted(muted) {
    this.sound.setMuted(muted);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.width = Math.max(320, rect.width);
    this.height = Math.max(420, rect.height);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const laneCount = clamp(Math.floor(this.width / 110), 4, 16);
    this.lanes = Array.from({ length: laneCount }, (_, index) => ({
      x: ((index + 0.5) / laneCount) * this.width,
      lastSpawn: -9999
    }));
  }

  nextWave() {
    this.waveIndex += 1;
    if (this.session.mode === "survival" && this.waveIndex >= this.session.waves.length) {
      const source = this.session.waves[this.waveIndex % this.session.waves.length];
      this.session.waves.push({
        ...source,
        id: `${source.id}-${this.waveIndex}`,
        index: this.waveIndex,
        spawned: 0,
        correctSpawned: 0,
        budget: Math.round(source.budget * (1 + this.waveIndex * 0.08)),
        correctTotal: Math.round(source.correctTotal * (1 + this.waveIndex * 0.08))
      });
    }
    this.currentWave = this.session.waves[this.waveIndex];
    if (!this.currentWave) {
      this.finish("complete");
      return;
    }
    this.currentWave.spawned = 0;
    this.currentWave.correctSpawned = 0;
    this.distractors = buildDistractorPool(this.currentWave.target, this.settings.semantic);
    this.transitionTime = this.waveIndex === 0 ? 0.9 : 1.15;
    this.stats.target = this.currentWave.target.target;
    this.stats.category = this.currentWave.target.category;
    this.stats.wave = this.waveIndex + 1;
    this.stats.waveCount = Number.isFinite(this.session.waveCount) ? this.session.waveCount : this.waveIndex + 1;
    this.stats.remainingCorrect += this.currentWave.correctTotal;
    this.sound.targetSwitch();
    this.callbacks.onTargetChange?.(this.snapshot());
  }

  frame(time) {
    if (!this.running) return;
    const dt = this.paused ? 0 : Math.min(0.035, (time - this.last) / 1000 || 0.016);
    this.last = time;
    if (!this.paused) this.update(dt, time);
    this.draw(time);
    this.animation = requestAnimationFrame((nextTime) => this.frame(nextTime));
  }

  update(dt, time) {
    this.stats.elapsed += dt;
    if (this.session.timeLimit && this.stats.elapsed >= this.session.timeLimit) {
      this.finish("complete");
      return;
    }
    if (this.session.mode === "survival") {
      this.survivalRamp = Math.floor(this.stats.elapsed / 30);
    }

    this.updateAdaptive();
    this.updateBubbles(dt, time);
    this.updateEffects(dt);

    if (this.transitionTime > 0) {
      this.transitionTime -= dt;
    } else {
      this.spawn(dt);
    }

    this.checkWaveComplete();
    this.reportStats(dt);
  }

  updateAdaptive() {
    const attempts = this.stats.correctPops + this.stats.wrongPops;
    if (attempts < 12) return;
    const accuracy = this.stats.correctPops / Math.max(1, attempts);
    const reaction = this.stats.correctPops ? this.stats.reactionTotal / this.stats.correctPops : 2;
    let target = 1;
    if (accuracy > 0.96 && this.stats.combo > 12 && reaction < 1.05) target = 1.12;
    if (accuracy < 0.72 || this.stats.lives <= 1) target = 0.9;
    this.adaptiveFactor += (target - this.adaptiveFactor) * 0.012;
  }

  updateBubbles(dt, time) {
    const line = this.dangerLine();
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const bubble = this.active[i];
      bubble.age += dt;
      bubble.x += bubble.vx * dt + Math.sin(bubble.age * bubble.wobbleSpeed + bubble.wobblePhase) * bubble.wobble * dt;
      bubble.y += bubble.vy * dt;
      bubble.rotation += bubble.rotationSpeed * dt;
      if (bubble.x < bubble.radius) {
        bubble.x = bubble.radius;
        bubble.vx *= -0.25;
      } else if (bubble.x > this.width - bubble.radius) {
        bubble.x = this.width - bubble.radius;
        bubble.vx *= -0.25;
      }
      const bottom = bubble.y + bubble.height * 0.5;
      if (bottom >= line) {
        this.active.splice(i, 1);
        this.release(bubble);
        this.stats.destroyed += 1;
        if (bubble.isCorrect) this.missCorrect(bubble, time);
      }
    }
  }

  updateEffects(dt) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    for (let i = this.floaters.length - 1; i >= 0; i -= 1) {
      const f = this.floaters[i];
      f.life -= dt;
      f.y -= 36 * dt;
      if (f.life <= 0) this.floaters.splice(i, 1);
    }
  }

  spawn(dt) {
    if (!this.currentWave) return;
    if (this.active.length >= this.mobileAwareMaxActive()) return;
    if (this.currentWave.spawned >= this.currentWave.budget) return;

    const ramp = 1 + this.survivalRamp * 0.14;
    const spawnRate = this.settings.spawnPerSecond * this.adaptiveFactor * ramp;
    this.spawnAccumulator += spawnRate * dt;
    const burstLimit = this.session.difficulty === "expert" ? 5 : 3;
    let spawnedThisFrame = 0;
    while (this.spawnAccumulator >= 1 && spawnedThisFrame < burstLimit && this.active.length < this.mobileAwareMaxActive()) {
      this.spawnAccumulator -= 1;
      this.spawnOne();
      spawnedThisFrame += 1;
      if (this.currentWave.spawned >= this.currentWave.budget) break;
    }
  }

  spawnOne() {
    const wave = this.currentWave;
    const eventsRemaining = wave.budget - wave.spawned;
    const correctRemaining = wave.correctTotal - wave.correctSpawned;
    let isCorrect = false;
    if (correctRemaining > 0) {
      isCorrect = eventsRemaining <= correctRemaining || this.rng() < correctRemaining / eventsRemaining;
    }
    const text = isCorrect ? pick(this.rng, wave.target.correct) : pick(this.rng, this.distractors);
    const bubble = this.acquire();
    const size = this.fixedBubbleDiameter();
    const lane = this.pickLane(size);
    const fallMin = this.settings.fallSpeed[0];
    const fallMax = this.settings.fallSpeed[1];
    const ramp = 1 + this.survivalRamp * 0.16;
    Object.assign(bubble, {
      id: `${wave.id}:${wave.spawned}:${this.stats.spawned}`,
      text,
      isCorrect,
      x: clamp(lane.x + randomRange(this.rng, -34, 34), size * 0.5 + 8, this.width - size * 0.5 - 8),
      y: -size - randomRange(this.rng, 0, 110),
      vx: randomRange(this.rng, -this.settings.drift, this.settings.drift),
      vy: randomRange(this.rng, fallMin, fallMax) * this.adaptiveFactor * ramp,
      size,
      radius: size * 0.5,
      width: size,
      height: size,
      rotation: randomRange(this.rng, -0.08, 0.08),
      rotationSpeed: randomRange(this.rng, -0.18, 0.18),
      wobble: randomRange(this.rng, 3, 12),
      wobbleSpeed: randomRange(this.rng, 1.4, 2.9),
      wobblePhase: randomRange(this.rng, 0, Math.PI * 2),
      age: 0,
      spawnTime: performance.now(),
      colorVariant: createVisualVariant(this.rng),
      textLayout: layoutTextForCircle(this.ctx, text, size * 0.5)
    });
    wave.spawned += 1;
    this.stats.spawned += 1;
    if (isCorrect) wave.correctSpawned += 1;
    this.active.push(bubble);
  }

  pickLane(width) {
    const now = performance.now();
    const attempts = Math.min(6, this.lanes.length);
    let best = this.lanes[0];
    for (let i = 0; i < attempts; i += 1) {
      const candidate = this.lanes[Math.floor(this.rng() * this.lanes.length)];
      if (now - candidate.lastSpawn > 420) {
        best = candidate;
        break;
      }
      if (candidate.lastSpawn < best.lastSpawn) best = candidate;
    }
    best.lastSpawn = now + width * 0.5;
    return best;
  }

  checkWaveComplete() {
    if (!this.currentWave) return;
    if (this.currentWave.spawned < this.currentWave.budget || this.active.length > 0) return;
    if (this.session.isBoss && this.stats.bossHealth <= 0) {
      this.finish("complete");
      return;
    }
    if (this.waveIndex < this.session.waves.length - 1 || this.session.mode === "survival") {
      this.nextWave();
    } else {
      this.finish("complete");
    }
  }

  finish(reason) {
    if (this.complete || this.gameOver) return;
    if (reason === "gameOver") this.gameOver = true;
    else this.complete = true;
    const result = this.result(reason);
    this.sound.complete();
    this.callbacks[reason === "gameOver" ? "onGameOver" : "onComplete"]?.(result);
  }

  missCorrect(bubble) {
    this.stats.missed += 1;
    this.stats.remainingCorrect = Math.max(0, this.stats.remainingCorrect - 1);
    this.stats.combo = 0;
    this.floaters.push({ text: "MISS", x: bubble.x, y: this.dangerLine() - 20, color: "#b45309", life: 0.65 });
    this.sound.miss();
    if (this.settings.missDamage > 0) {
      this.stats.lives = Math.max(0, this.stats.lives - this.settings.missDamage);
      this.shake(4);
      if (this.stats.lives <= 0) this.finish("gameOver");
    } else {
      this.stats.score = Math.max(0, this.stats.score - 25);
    }
  }

  handlePointer(event) {
    if (!this.running || this.paused || this.transitionTime > 0) return;
    this.sound.ensure();
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const bubble = this.active[i];
      if (!hitBubble(bubble, x, y)) continue;
      this.popBubble(bubble, i);
      break;
    }
  }

  popBubble(bubble, index) {
    this.active.splice(index, 1);
    this.stats.destroyed += 1;
    if (bubble.isCorrect) {
      this.stats.correctPops += 1;
      this.stats.remainingCorrect = Math.max(0, this.stats.remainingCorrect - 1);
      this.stats.combo += 1;
      this.stats.bestCombo = Math.max(this.stats.bestCombo, this.stats.combo);
      const reaction = (performance.now() - bubble.spawnTime) / 1000;
      this.stats.reactionTotal += reaction;
      const base = 55 + Math.min(240, this.stats.combo * 5);
      const score = Math.round(base * this.settings.scoreMultiplier);
      this.stats.score += score;
      if (this.session.isBoss) {
        this.stats.bossHealth = Math.max(0, this.stats.bossHealth - score);
      }
      this.burst(bubble, "#54ff93", 16 + Math.min(18, this.stats.combo));
      this.floaters.push({ text: `+${score}`, x: bubble.x, y: bubble.y - 10, color: "#047857", life: 0.72 });
      this.sound.correct(this.stats.combo);
    } else {
      this.stats.wrongPops += 1;
      this.stats.combo = 0;
      this.stats.lives = Math.max(0, this.stats.lives - this.settings.wrongDamage);
      if (this.session.isBoss) {
        this.stats.bossHealth = Math.min(this.session.bossHealth, this.stats.bossHealth + Math.round(95 * this.settings.scoreMultiplier));
      }
      this.burst(bubble, "#ff5d77", 12);
      this.floaters.push({ text: "WRONG", x: bubble.x, y: bubble.y - 10, color: "#be123c", life: 0.65 });
      this.shake(6);
      this.sound.wrong();
      if (this.stats.lives <= 0) this.finish("gameOver");
    }
    this.release(bubble);
  }

  burst(bubble, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = this.rng() * Math.PI * 2;
      const speed = randomRange(this.rng, 52, 210);
      this.particles.push({
        x: bubble.x,
        y: bubble.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: randomRange(this.rng, 0.28, 0.58),
        maxLife: 0.58,
        size: randomRange(this.rng, 1.5, 4.2)
      });
    }
  }

  shake(amount) {
    this.canvas.parentElement?.style.setProperty("--shake", `${amount}px`);
    window.setTimeout(() => this.canvas.parentElement?.style.setProperty("--shake", "0px"), 120);
  }

  acquire() {
    return this.pool.pop() || {};
  }

  release(bubble) {
    if (this.pool.length < 260) this.pool.push(bubble);
  }

  mobileAwareMaxActive() {
    if (this.width < 620) return Math.max(14, Math.round(this.settings.maxActive * 0.48));
    if (this.width < 900) return Math.round(this.settings.maxActive * 0.68);
    return this.settings.maxActive;
  }

  fixedBubbleDiameter() {
    const base = this.settings.size[0];
    if (this.width < 520) return Math.round(clamp(this.width * 0.22, 76, 90));
    if (this.width < 820) return Math.min(base, 96);
    return base;
  }

  dangerLine() {
    return this.height - dangerGap;
  }

  reportStats(dt) {
    this.statsTick += dt;
    this.fpsSamples.push(1 / Math.max(dt, 0.001));
    if (this.fpsSamples.length > 45) this.fpsSamples.shift();
    if (this.statsTick < 0.16) return;
    this.statsTick = 0;
    this.stats.fps = Math.round(this.fpsSamples.reduce((sum, value) => sum + value, 0) / this.fpsSamples.length);
    this.callbacks.onStats?.(this.snapshot());
  }

  snapshot() {
    const attempts = this.stats.correctPops + this.stats.wrongPops;
    return {
      ...this.stats,
      active: this.active.length,
      totalBudget: this.session.totalBudget,
      remaining: Number.isFinite(this.session.totalBudget) ? Math.max(0, this.session.totalBudget - this.stats.spawned) : Infinity,
      accuracy: attempts ? Math.round((this.stats.correctPops / attempts) * 100) : 100,
      timeLimit: this.session.timeLimit,
      mode: this.session.mode,
      difficulty: this.session.difficulty,
      level: this.session.level,
      isBoss: this.session.isBoss,
      bossMax: this.session.bossHealth,
      paused: this.paused
    };
  }

  result(reason) {
    const snapshot = this.snapshot();
    return {
      ...snapshot,
      reason,
      averageReaction: this.stats.correctPops ? this.stats.reactionTotal / this.stats.correctPops : 0
    };
  }

  draw(time) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const shake = Number.parseFloat(this.canvas.parentElement?.style.getPropertyValue("--shake") || "0") || 0;
    ctx.save();
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#fffef8");
    bg.addColorStop(0.55, "#fcfcfc");
    bg.addColorStop(1, "#f0f4f8");
    ctx.fillStyle = bg;
    ctx.fillRect(-10, -10, w + 20, h + 20);
    drawGrid(ctx, w, h, time);
    for (const bubble of this.active) this.drawBubble(ctx, bubble);
    for (const p of this.particles) {
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const f of this.floaters) {
      ctx.globalAlpha = clamp(f.life / 0.72, 0, 1);
      ctx.fillStyle = f.color;
      ctx.font = "900 18px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(255,255,255,0.82)";
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
    drawDanger(ctx, w, this.dangerLine(), time);
    if (this.transitionTime > 0 && this.currentWave) drawTransition(ctx, w, h, this.currentWave.target.target, this.waveIndex + 1);
    if (this.paused) drawPaused(ctx, w, h);
    ctx.restore();
  }

  drawBubble(ctx, bubble) {
    ctx.save();
    ctx.translate(bubble.x, bubble.y);
    ctx.rotate(bubble.rotation);
    const v = bubble.colorVariant;
    const alpha = clamp(bubble.age * 2.5, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "rgba(55,65,81,0.22)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    const radius = bubble.radius;
    const gradient = ctx.createRadialGradient(-radius * 0.32, -radius * 0.34, 2, 0, 0, radius);
    gradient.addColorStop(0, hexToRgba(v.shine, 0.52));
    gradient.addColorStop(0.2, hexToRgba(v.fillA, Math.max(0.18, v.fillAlphaA - 0.16)));
    gradient.addColorStop(0.78, hexToRgba(v.fillB, Math.max(0.14, v.fillAlphaB - 0.12)));
    gradient.addColorStop(1, "rgba(255,255,255,0.18)");
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = "rgba(55,65,81,0.88)";
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1.5, -1.2, radius * 0.96, -0.22, Math.PI * 1.82);
    ctx.strokeStyle = hexToRgba(v.fillB, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = alpha * v.highlight;
    ctx.beginPath();
    ctx.ellipse(-radius * 0.28, -radius * 0.34, radius * 0.36, radius * 0.13, -0.16, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fill();
    ctx.globalAlpha = alpha;
    const layout = bubble.textLayout || layoutTextForCircle(ctx, bubble.text, radius);
    ctx.font = `900 ${layout.fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(2, layout.fontSize * 0.24);
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.fillStyle = "#111827";
    layout.lines.forEach((line, index) => {
      const y = (index - (layout.lines.length - 1) / 2) * layout.lineHeight;
      ctx.strokeText(line, 0, y + 0.5);
      ctx.fillText(line, 0, y);
    });
    ctx.restore();
  }
}

function createStats(session) {
  return {
    level: session.level,
    score: 0,
    combo: 0,
    bestCombo: 0,
    lives: session.settings.lives,
    correctPops: 0,
    wrongPops: 0,
    missed: 0,
    spawned: 0,
    destroyed: 0,
    remainingCorrect: 0,
    reactionTotal: 0,
    elapsed: 0,
    fps: 60,
    active: 0,
    target: "",
    category: "",
    wave: 0,
    waveCount: session.waveCount,
    bossHealth: session.bossHealth
  };
}

function randomRange(rng, min, max) {
  return min + rng() * (max - min);
}

function hitBubble(bubble, x, y) {
  const dx = x - bubble.x;
  const dy = y - bubble.y;
  return dx * dx + dy * dy <= Math.pow(bubble.radius * 1.06, 2);
}

function layoutTextForCircle(ctx, text, radius) {
  const box = radius * 1.44;
  for (let fontSize = 14; fontSize >= 5.5; fontSize -= 0.5) {
    ctx.font = `900 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
    const lineHeight = fontSize * 1.08;
    const lines = wrapText(ctx, text, box);
    if (lines.length * lineHeight <= box && lines.every((line) => ctx.measureText(line).width <= box)) {
      return { lines, fontSize, lineHeight };
    }
  }
  const fontSize = 5.5;
  ctx.font = `900 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  return {
    lines: wrapText(ctx, text, box),
    fontSize,
    lineHeight: fontSize * 1.04
  };
}

function wrapText(ctx, text, maxWidth) {
  const tokens = String(text).trim().split(/\s+/).flatMap((token) => splitToken(ctx, token, maxWidth));
  const lines = [];
  let current = "";
  for (const token of tokens) {
    const candidate = current ? `${current} ${token}` : token;
    if (!current || ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = token;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [String(text)];
}

function splitToken(ctx, token, maxWidth) {
  if (ctx.measureText(token).width <= maxWidth) return [token];
  const chunks = [];
  let chunk = "";
  for (const char of token) {
    const candidate = chunk + char;
    if (!chunk || ctx.measureText(candidate).width <= maxWidth) {
      chunk = candidate;
    } else {
      chunks.push(chunk);
      chunk = char;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawGrid(ctx, width, height, time) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(55,65,81,0.08)";
  ctx.lineWidth = 1;
  const offset = (time * 0.02) % 32;
  for (let y = -32 + offset; y < height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(37,99,235,0.08)";
  ctx.setLineDash([5, 12]);
  for (let x = 0; x < width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.restore();
}

function drawDanger(ctx, width, y, time) {
  const pulse = 0.45 + Math.sin(time * 0.008) * 0.18;
  ctx.save();
  ctx.shadowColor = "rgba(225,29,72,0.18)";
  ctx.shadowBlur = 4 + pulse * 4;
  ctx.strokeStyle = `rgba(225,29,72,${0.7 + pulse * 0.18})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(225,29,72,0.06)";
  ctx.fillRect(0, y, width, 42);
  ctx.restore();
}

function drawTransition(ctx, width, height, target, wave) {
  ctx.save();
  ctx.fillStyle = "rgba(252,252,252,0.84)";
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#2563eb";
  ctx.font = "900 13px JetBrains Mono, Menlo, monospace";
  ctx.fillText(wave === 1 ? "TARGET LOCKED" : "TARGET CHANGED", width / 2, height * 0.42);
  ctx.fillStyle = "#111827";
  ctx.font = `900 ${Math.max(28, Math.min(54, width / 12))}px Inter, system-ui, sans-serif`;
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.strokeText(target.toUpperCase(), width / 2, height * 0.5);
  ctx.fillText(target.toUpperCase(), width / 2, height * 0.5);
  ctx.restore();
}

function drawPaused(ctx, width, height) {
  ctx.save();
  ctx.fillStyle = "rgba(252,252,252,0.78)";
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#111827";
  ctx.font = "900 32px Inter, system-ui, sans-serif";
  ctx.fillText("PAUSED", width / 2, height / 2);
  ctx.restore();
}
