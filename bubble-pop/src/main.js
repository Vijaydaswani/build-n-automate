import { dailySeed, DIFFICULTIES, KNOWLEDGE_BASE, rankForXp, WORLDS } from "./game/balance.js";
import { GameEngine } from "./game/engine.js";

const app = document.querySelector("#app");
const storageKey = "devops-bubble-pop-profile";
let engine = null;
let ambientStop = null;
let pendingMode = "quick";
let pendingWorld = "";
let muted = localStorage.getItem("dbp-muted") === "true";
let currentRun = null;

const defaultProfile = {
  xp: 0,
  highestLevel: 1,
  bestCombo: 0,
  totalBubblesPopped: 0,
  totalCorrectPops: 0,
  totalWrongPops: 0,
  survivalRecord: 0,
  mastery: {},
  leaderboard: []
};

function loadProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return { ...defaultProfile };
  }
}

function saveProfile(profile) {
  localStorage.setItem(storageKey, JSON.stringify(profile));
}

function format(value) {
  if (value === Infinity) return "ENDLESS";
  return Number(value || 0).toLocaleString();
}

function pct(value) {
  return `${Math.round(value || 0)}%`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function setScreen(name, payload = {}) {
  if (engine) {
    engine.stop();
    engine = null;
  }
  if (ambientStop) {
    ambientStop();
    ambientStop = null;
  }

  const profile = loadProfile();
  if (name === "landing") renderLanding(profile);
  if (name === "mode") renderModes();
  if (name === "difficulty") renderDifficulty();
  if (name === "worlds") renderWorlds();
  if (name === "game") renderGame(payload);
  if (name === "complete") renderComplete(payload.result, payload.gameOver);
  if (name === "profile") renderProfile(profile);
  if (name === "leaderboard") renderLeaderboard(profile);
}

function renderLanding(profile) {
  app.innerHTML = `
    <main class="landing">
      <canvas class="ambient-canvas" id="ambientCanvas" aria-hidden="true"></canvas>
      <section class="landing-copy">
        <p class="eyebrow">Pop the stack. Master DevOps.</p>
        <h1>DevOps Bubble Pop</h1>
        <p class="maker-credit">by <strong>Build &amp; Automate</strong> <span>Vijay Daswani</span></p>
        <p class="tagline">How fast can you recognize your stack?</p>
        <div class="landing-actions">
          <button class="primary" data-action="play">Play</button>
          <button data-action="survival">Survival</button>
          <button data-action="worlds">Worlds</button>
          <button data-action="daily">Daily Challenge</button>
          <button data-action="leaderboard">Leaderboard</button>
          <button data-action="profile">Profile</button>
        </div>
      </section>
      <aside class="profile-strip">
        <span>${escapeHtml(rankForXp(profile.xp))}</span>
        <strong>${format(profile.xp)} XP</strong>
        <span>Best x${format(profile.bestCombo)}</span>
      </aside>
    </main>
  `;
  app.querySelector("[data-action='play']").addEventListener("click", () => {
    pendingMode = "quick";
    pendingWorld = "";
    setScreen("difficulty");
  });
  app.querySelector("[data-action='survival']").addEventListener("click", () => {
    pendingMode = "survival";
    pendingWorld = "";
    setScreen("difficulty");
  });
  app.querySelector("[data-action='worlds']").addEventListener("click", () => setScreen("worlds"));
  app.querySelector("[data-action='daily']").addEventListener("click", () => {
    pendingMode = "daily";
    pendingWorld = "";
    startGame("intermediate");
  });
  app.querySelector("[data-action='leaderboard']").addEventListener("click", () => setScreen("leaderboard"));
  app.querySelector("[data-action='profile']").addEventListener("click", () => setScreen("profile"));
  ambientStop = startAmbient(app.querySelector("#ambientCanvas"));
}

function renderModes() {
  const modes = [
    ["quick", "Quick Play"],
    ["survival", "Survival"],
    ["speed", "Speed Run"],
    ["command", "Command Battle"],
    ["cloud", "Cloud Wars"],
    ["incident", "Incident Response"],
    ["boss", "Boss Rush"],
    ["daily", "Daily Challenge"]
  ];
  app.innerHTML = `
    <main class="menu-screen">
      <header class="menu-header">
        <button data-action="back">Back</button>
        <div>
          <p class="eyebrow">Game Mode</p>
          <h1>Select Run</h1>
        </div>
      </header>
      <section class="mode-grid">
        ${modes
          .map(
            ([id, label]) => `
              <button class="mode-tile" data-mode="${id}">
                <strong>${label}</strong>
                <span>${modeCaption(id)}</span>
              </button>
            `
          )
          .join("")}
      </section>
    </main>
  `;
  app.querySelector("[data-action='back']").addEventListener("click", () => setScreen("landing"));
  app.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingMode = button.dataset.mode;
      pendingWorld = "";
      if (pendingMode === "daily") startGame("intermediate");
      else setScreen("difficulty");
    });
  });
}

function modeCaption(mode) {
  return {
    quick: "Procedural waves",
    survival: "Infinite pressure",
    speed: "60 seconds",
    command: "CLI only",
    cloud: "AWS Azure GCP",
    incident: "Production calls",
    boss: "Heavy waves",
    daily: "Seeded today"
  }[mode];
}

function renderDifficulty() {
  app.innerHTML = `
    <main class="menu-screen">
      <header class="menu-header">
        <button data-action="back">Back</button>
        <div>
          <p class="eyebrow">Select Your Level</p>
          <h1>${escapeHtml(modeTitle(pendingMode))}</h1>
        </div>
      </header>
      <section class="difficulty-grid">
        ${Object.values(DIFFICULTIES)
          .map(
            (difficulty) => `
              <button class="difficulty-card ${difficulty.id}" data-difficulty="${difficulty.id}">
                <span>${difficulty.label}</span>
                <strong>${difficulty.subtitle}</strong>
                <small>${difficulty.bubbleNote}</small>
                <small>${difficulty.speedNote}</small>
              </button>
            `
          )
          .join("")}
      </section>
      <button class="text-link" data-action="modes">All Modes</button>
    </main>
  `;
  app.querySelector("[data-action='back']").addEventListener("click", () => setScreen(pendingWorld ? "worlds" : "landing"));
  app.querySelector("[data-action='modes']").addEventListener("click", () => setScreen("mode"));
  app.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => startGame(button.dataset.difficulty));
  });
}

function modeTitle(mode) {
  return {
    quick: "Quick Play",
    survival: "Survival",
    speed: "Speed Run",
    command: "Command Battle",
    cloud: "Cloud Wars",
    incident: "Incident Response",
    boss: "Boss Rush",
    daily: "Daily Challenge"
  }[mode] || "Quick Play";
}

function renderWorlds() {
  app.innerHTML = `
    <main class="menu-screen">
      <header class="menu-header">
        <button data-action="back">Back</button>
        <div>
          <p class="eyebrow">World Mode</p>
          <h1>Choose a Stack</h1>
        </div>
      </header>
      <section class="world-grid">
        ${WORLDS.map((world) => `<button data-world="${escapeHtml(world)}">${escapeHtml(world)}</button>`).join("")}
      </section>
    </main>
  `;
  app.querySelector("[data-action='back']").addEventListener("click", () => setScreen("landing"));
  app.querySelectorAll("[data-world]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingMode = "quick";
      pendingWorld = button.dataset.world;
      setScreen("difficulty");
    });
  });
}

function startGame(difficulty) {
  const profile = loadProfile();
  const level = Math.max(1, profile.highestLevel || 1);
  const seed = pendingMode === "daily" ? dailySeed() : `${Date.now()}:${Math.random()}`;
  currentRun = {
    mode: pendingMode,
    difficulty,
    level: pendingMode === "boss" ? nextBossLevel(level) : level,
    world: pendingWorld,
    seed
  };
  setScreen("game", currentRun);
}

function nextBossLevel(level) {
  return Math.max(10, Math.ceil(level / 10) * 10);
}

function renderGame(options) {
  app.innerHTML = `
    <main class="game-shell">
      <section class="top-hud">
        <div><span>Level</span><strong id="hudLevel">1</strong></div>
        <div><span>Target</span><strong id="hudTarget">LOCKING</strong></div>
        <div><span>Score</span><strong id="hudScore">0</strong></div>
        <div><span>Combo</span><strong id="hudCombo">x0</strong></div>
        <div><span>Lives</span><strong id="hudLives">5</strong></div>
        <div><span>Accuracy</span><strong id="hudAccuracy">100%</strong></div>
        <button class="icon-button" id="pauseButton" title="Pause">II</button>
        <button class="icon-button" id="muteButton" title="Sound">${muted ? "M" : "S"}</button>
      </section>
      <div class="corner-credit">Build &amp; Automate <span>Vijay Daswani</span></div>
      <section class="target-panel">
        <span>Pop Everything Related To</span>
        <strong id="targetName">Locking</strong>
        <small id="waveInfo">Wave 1</small>
      </section>
      <section class="boss-panel hidden" id="bossPanel">
        <span>Boss</span>
        <div><i id="bossHealth"></i></div>
      </section>
      <section class="arena-wrap">
        <canvas id="gameCanvas"></canvas>
        <div class="terminal-label">Terminal Line</div>
      </section>
      <section class="debug-bar">
        <span>Spawned <strong id="dbgSpawned">0</strong></span>
        <span>Active <strong id="dbgActive">0</strong></span>
        <span>Destroyed <strong id="dbgDestroyed">0</strong></span>
        <span>Remaining <strong id="dbgRemaining">0</strong></span>
        <span>FPS <strong id="dbgFps">60</strong></span>
      </section>
      <section class="pause-menu hidden" id="pauseMenu">
        <h2>Paused</h2>
        <button class="primary" data-action="resume">Resume</button>
        <button data-action="restart">Restart</button>
        <button data-action="exit">Exit</button>
      </section>
    </main>
  `;

  const canvas = app.querySelector("#gameCanvas");
  const elements = hudElements();
  engine = new GameEngine(canvas, {
    onStats: (state) => updateHud(elements, state),
    onTargetChange: (state) => updateHud(elements, state),
    onComplete: (result) => finishRun(result, false),
    onGameOver: (result) => finishRun(result, true)
  });
  engine.setMuted(muted);
  engine.start(options);
  app.querySelector("#pauseButton").addEventListener("click", togglePause);
  app.querySelector("#muteButton").addEventListener("click", () => {
    muted = !muted;
    engine.setMuted(muted);
    app.querySelector("#muteButton").textContent = muted ? "M" : "S";
  });
  app.querySelector("[data-action='resume']").addEventListener("click", togglePause);
  app.querySelector("[data-action='restart']").addEventListener("click", () => setScreen("game", currentRun));
  app.querySelector("[data-action='exit']").addEventListener("click", () => setScreen("landing"));
}

function hudElements() {
  return {
    level: app.querySelector("#hudLevel"),
    target: app.querySelector("#hudTarget"),
    score: app.querySelector("#hudScore"),
    combo: app.querySelector("#hudCombo"),
    lives: app.querySelector("#hudLives"),
    accuracy: app.querySelector("#hudAccuracy"),
    targetName: app.querySelector("#targetName"),
    waveInfo: app.querySelector("#waveInfo"),
    bossPanel: app.querySelector("#bossPanel"),
    bossHealth: app.querySelector("#bossHealth"),
    spawned: app.querySelector("#dbgSpawned"),
    active: app.querySelector("#dbgActive"),
    destroyed: app.querySelector("#dbgDestroyed"),
    remaining: app.querySelector("#dbgRemaining"),
    fps: app.querySelector("#dbgFps")
  };
}

function updateHud(elements, state) {
  elements.level.textContent = state.level;
  elements.target.textContent = state.target.toUpperCase();
  elements.score.textContent = format(state.score);
  elements.combo.textContent = `x${format(state.combo)}`;
  elements.lives.textContent = Math.ceil(state.lives);
  elements.accuracy.textContent = pct(state.accuracy);
  elements.targetName.textContent = state.target;
  elements.waveInfo.textContent = `Wave ${format(state.wave)} / ${format(state.waveCount)}`;
  elements.spawned.textContent = `${format(state.spawned)} / ${format(state.totalBudget)}`;
  elements.active.textContent = format(state.active);
  elements.destroyed.textContent = format(state.destroyed);
  elements.remaining.textContent = format(state.remaining);
  elements.fps.textContent = format(state.fps);
  if (state.isBoss) {
    elements.bossPanel.classList.remove("hidden");
    const pctValue = state.bossMax ? Math.max(0, state.bossHealth / state.bossMax) * 100 : 0;
    elements.bossHealth.style.width = `${pctValue}%`;
  } else {
    elements.bossPanel.classList.add("hidden");
  }
}

function togglePause() {
  if (!engine) return;
  const menu = app.querySelector("#pauseMenu");
  if (engine.paused) {
    engine.resume();
    menu.classList.add("hidden");
  } else {
    engine.pause();
    menu.classList.remove("hidden");
  }
}

function finishRun(result, gameOver) {
  const profile = applyResult(result, gameOver);
  saveProfile(profile);
  window.setTimeout(() => setScreen("complete", { result, gameOver }), 260);
}

function applyResult(result, gameOver) {
  const profile = loadProfile();
  const xp = Math.max(20, Math.round(result.score / 12 + result.correctPops * 4 + result.bestCombo * 3));
  profile.xp += xp;
  profile.bestCombo = Math.max(profile.bestCombo, result.bestCombo);
  profile.totalBubblesPopped += result.correctPops + result.wrongPops;
  profile.totalCorrectPops += result.correctPops;
  profile.totalWrongPops += result.wrongPops;
  if (!gameOver && result.mode === "quick") profile.highestLevel = Math.max(profile.highestLevel, result.level + 1);
  if (result.mode === "survival") profile.survivalRecord = Math.max(profile.survivalRecord, Math.round(result.elapsed));
  const mastery = profile.mastery[result.category] || { correct: 0, wrong: 0, missed: 0 };
  mastery.correct += result.correctPops;
  mastery.wrong += result.wrongPops;
  mastery.missed += result.missed;
  profile.mastery[result.category] = mastery;
  profile.leaderboard = [
    {
      score: result.score,
      mode: result.mode,
      difficulty: result.difficulty,
      level: result.level,
      combo: result.bestCombo,
      accuracy: result.accuracy,
      date: new Date().toISOString()
    },
    ...(profile.leaderboard || [])
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  result.xpAwarded = xp;
  result.newRank = rankForXp(profile.xp);
  return profile;
}

function renderComplete(result, gameOver) {
  app.innerHTML = `
    <main class="results-screen">
      <section class="results-header">
        <p class="eyebrow">${gameOver ? "Run Ended" : "Level Complete"}</p>
        <h1>${gameOver ? "Stack Overflowed" : `Level ${format(result.level)} Complete`}</h1>
        <p class="maker-credit">by <strong>Build &amp; Automate</strong> <span>Vijay Daswani</span></p>
      </section>
      <section class="stat-grid">
        ${resultStat("Accuracy", pct(result.accuracy))}
        ${resultStat("Score", format(result.score))}
        ${resultStat("Correct Pops", format(result.correctPops))}
        ${resultStat("Wrong Pops", format(result.wrongPops))}
        ${resultStat("Missed", format(result.missed))}
        ${resultStat("Best Combo", `x${format(result.bestCombo)}`)}
        ${resultStat("Average Reaction", `${result.averageReaction.toFixed(2)}s`)}
        ${resultStat("XP", `+${format(result.xpAwarded)}`)}
      </section>
      <section class="results-actions">
        <button class="primary" data-action="next">${gameOver ? "Retry" : "Next Level"}</button>
        <button data-action="modes">Modes</button>
        <button data-action="home">Home</button>
      </section>
    </main>
  `;
  app.querySelector("[data-action='next']").addEventListener("click", () => {
    const profile = loadProfile();
    currentRun = {
      ...currentRun,
      level: gameOver ? currentRun.level : Math.max(profile.highestLevel, currentRun.level + 1),
      seed: `${Date.now()}:${Math.random()}`
    };
    setScreen("game", currentRun);
  });
  app.querySelector("[data-action='modes']").addEventListener("click", () => setScreen("mode"));
  app.querySelector("[data-action='home']").addEventListener("click", () => setScreen("landing"));
}

function resultStat(label, value) {
  return `<div class="result-stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderProfile(profile) {
  const categories = Object.entries(profile.mastery || {})
    .sort((a, b) => categoryAccuracy(b[1]) - categoryAccuracy(a[1]))
    .slice(0, 12);
  app.innerHTML = `
    <main class="menu-screen">
      <header class="menu-header">
        <button data-action="back">Back</button>
        <div>
          <p class="eyebrow">${escapeHtml(rankForXp(profile.xp))}</p>
          <h1>Profile</h1>
        </div>
      </header>
      <section class="stat-grid">
        ${resultStat("XP", format(profile.xp))}
        ${resultStat("Highest Level", format(profile.highestLevel))}
        ${resultStat("Best Combo", `x${format(profile.bestCombo)}`)}
        ${resultStat("Total Pops", format(profile.totalBubblesPopped))}
        ${resultStat("Correct Pops", format(profile.totalCorrectPops))}
        ${resultStat("Survival Record", `${format(profile.survivalRecord)}s`)}
      </section>
      <section class="mastery-list">
        <h2>Knowledge Map</h2>
        ${
          categories.length
            ? categories
                .map(([category, data]) => {
                  const accuracy = categoryAccuracy(data);
                  return `<div><span>${escapeHtml(category)}</span><meter min="0" max="100" value="${accuracy}"></meter><strong>${accuracy}%</strong></div>`;
                })
                .join("")
            : `<p>No mastery data yet.</p>`
        }
      </section>
    </main>
  `;
  app.querySelector("[data-action='back']").addEventListener("click", () => setScreen("landing"));
}

function categoryAccuracy(data) {
  const attempts = data.correct + data.wrong + data.missed;
  return attempts ? Math.round((data.correct / attempts) * 100) : 0;
}

function renderLeaderboard(profile) {
  const rows = profile.leaderboard || [];
  app.innerHTML = `
    <main class="menu-screen">
      <header class="menu-header">
        <button data-action="back">Back</button>
        <div>
          <p class="eyebrow">Top Runs</p>
          <h1>Leaderboard</h1>
        </div>
      </header>
      <section class="leaderboard">
        ${
          rows.length
            ? rows
                .map(
                  (row, index) => `
                    <div>
                      <span>${index + 1}</span>
                      <strong>${format(row.score)}</strong>
                      <small>${escapeHtml(row.mode)} / ${escapeHtml(row.difficulty)} / L${format(row.level)}</small>
                      <small>x${format(row.combo)} / ${pct(row.accuracy)}</small>
                    </div>
                  `
                )
                .join("")
            : `<p>No runs yet.</p>`
        }
      </section>
    </main>
  `;
  app.querySelector("[data-action='back']").addEventListener("click", () => setScreen("landing"));
}

function startAmbient(canvas) {
  const ctx = canvas.getContext("2d");
  const terms = ["K8s", "Docker", "Terraform", "Git", "AWS", "Azure", "Jenkins", "Prometheus", "Linux", "Vault", "Helm", "SLO"];
  const bubbles = [];
  let frameId = 0;
  let dpr = 1;
  let width = 1;
  let height = 1;
  const colors = ["#22d3ee", "#a855f7", "#fb923c", "#2dd4bf", "#e879f9", "#a3e635", "#2563eb", "#f59e0b"];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    if (bubbles.length < 42 && Math.random() < 0.45) {
      bubbles.push({
        x: Math.random() * width,
        y: -60,
        r: 26 + Math.random() * 30,
        vy: 22 + Math.random() * 46,
        vx: -8 + Math.random() * 16,
        text: terms[Math.floor(Math.random() * terms.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        a: 0.18 + Math.random() * 0.16,
        tilt: -0.12 + Math.random() * 0.24
      });
    }
    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const b = bubbles[i];
      b.y += b.vy / 60;
      b.x += b.vx / 60;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.tilt);
      ctx.globalAlpha = b.a;
      ctx.shadowColor = "rgba(55,65,81,0.18)";
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = "#111827";
      ctx.font = "900 13px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.text, 0, 0);
      ctx.restore();
      if (b.y > height + 90) bubbles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    frameId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  loop();
  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
  };
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && engine) togglePause();
});

window.__DEVOPS_BUBBLE_POP__ = {
  dataTargets: KNOWLEDGE_BASE.length,
  difficulties: Object.keys(DIFFICULTIES)
};

setScreen("landing");
