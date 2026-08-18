export const BUBBLE_PALETTE = [
  { name: "blue", a: "#4f8cff", b: "#1f4ed8", c: "#dce9ff" },
  { name: "cyan", a: "#22d3ee", b: "#087c9b", c: "#dffbff" },
  { name: "purple", a: "#a855f7", b: "#5b21b6", c: "#f0ddff" },
  { name: "pink", a: "#fb5fb7", b: "#be185d", c: "#ffe1f1" },
  { name: "orange", a: "#fb923c", b: "#c2410c", c: "#ffecd8" },
  { name: "yellow", a: "#facc15", b: "#a16207", c: "#fff5b8" },
  { name: "teal", a: "#2dd4bf", b: "#0f766e", c: "#d7fff9" },
  { name: "lime", a: "#a3e635", b: "#4d7c0f", c: "#f0ffd0" },
  { name: "indigo", a: "#818cf8", b: "#3730a3", c: "#e6e8ff" },
  { name: "magenta", a: "#e879f9", b: "#a21caf", c: "#fde7ff" }
];

export const DIFFICULTIES = {
  beginner: {
    id: "beginner",
    label: "Beginner",
    subtitle: "Learn the Stack",
    bubbleNote: "100 bubbles",
    speedNote: "Calm fall",
    totalFloor: 100,
    totalMultiplier: 3.5,
    spawnPerSecond: 0.85,
    maxActive: 8,
    fallSpeed: [26, 42],
    drift: 12,
    size: [118, 118],
    correctDensity: 0.3,
    semantic: 0,
    waveCount: 1,
    lives: 5,
    wrongDamage: 0.35,
    missDamage: 0,
    scoreMultiplier: 1
  },
  intermediate: {
    id: "intermediate",
    label: "Intermediate",
    subtitle: "Know the Stack",
    bubbleNote: "140 bubbles",
    speedNote: "Steady fall",
    totalFloor: 140,
    totalMultiplier: 6,
    spawnPerSecond: 1.15,
    maxActive: 11,
    fallSpeed: [32, 52],
    drift: 20,
    size: [118, 118],
    correctDensity: 0.25,
    semantic: 1,
    waveCount: 2,
    lives: 4,
    wrongDamage: 0.45,
    missDamage: 0,
    scoreMultiplier: 1.25
  },
  advanced: {
    id: "advanced",
    label: "Advanced",
    subtitle: "Master the Stack",
    bubbleNote: "180 bubbles",
    speedNote: "Measured pressure",
    totalFloor: 180,
    totalMultiplier: 10.5,
    spawnPerSecond: 1.45,
    maxActive: 14,
    fallSpeed: [40, 66],
    drift: 30,
    size: [118, 118],
    correctDensity: 0.22,
    semantic: 2,
    waveCount: 3,
    lives: 4,
    wrongDamage: 0.55,
    missDamage: 0.5,
    scoreMultiplier: 1.65
  },
  expert: {
    id: "expert",
    label: "Expert",
    subtitle: "Survive the Stack",
    bubbleNote: "220 bubbles",
    speedNote: "Fast but fair",
    totalFloor: 220,
    totalMultiplier: 16,
    spawnPerSecond: 1.75,
    maxActive: 17,
    fallSpeed: [50, 82],
    drift: 45,
    size: [118, 118],
    correctDensity: 0.2,
    semantic: 3,
    waveCount: 3,
    lives: 4,
    wrongDamage: 0.65,
    missDamage: 0.75,
    scoreMultiplier: 2
  }
};

export const RANKS = [
  ["Intern", 0],
  ["Junior Engineer", 1200],
  ["DevOps Engineer", 3600],
  ["Senior DevOps Engineer", 8200],
  ["SRE", 14500],
  ["Platform Engineer", 23500],
  ["DevSecOps Engineer", 36500],
  ["Cloud Architect", 56000],
  ["Platform Architect", 82000],
  ["Principal Engineer", 120000],
  ["Infrastructure Legend", 180000]
];

const commandDistractors = [
  "terraform plan",
  "terraform apply",
  "terraform state list",
  "terraform import",
  "kubectl get pods",
  "kubectl describe pod",
  "kubectl rollout status deployment/api",
  "kubectl logs deployment/web",
  "docker inspect nginx",
  "docker build -t api .",
  "git rebase main",
  "git cherry-pick",
  "aws ec2 describe-instances",
  "az vm list",
  "gcloud compute instances list",
  "helm template",
  "ansible-playbook site.yml",
  "vault kv get secret/app",
  "openssl s_client",
  "dig +trace example.com"
];

export const KNOWLEDGE_BASE = [
  {
    id: "jenkins",
    target: "Jenkins",
    category: "CI/CD",
    worlds: ["Jenkins", "CI/CD"],
    type: "technology",
    correct: [
      "Jenkinsfile",
      "Groovy",
      "Pipeline",
      "Declarative Pipeline",
      "Scripted Pipeline",
      "Shared Library",
      "Agent",
      "Stage",
      "Steps",
      "Executor",
      "Workspace",
      "Credentials",
      "post",
      "when",
      "environment",
      "parallel",
      "parameters",
      "stash",
      "unstash",
      "archiveArtifacts",
      "withCredentials",
      "input",
      "timeout",
      "retry"
    ],
    distractors: {
      beginner: ["ReplicaSet", "Route53", "Terraform State", "PromQL", "IngressClass"],
      intermediate: ["GitHub Actions matrix", "GitLab runner", "Argo Application", "Helm values.yaml"],
      advanced: ["Tekton TaskRun", "CircleCI orb", "Buildkite agent", "Azure pipeline stage"],
      expert: ["workflow_call", "needs context", "default image", "parallelism key", "deployment strategy"]
    }
  },
  {
    id: "docker",
    target: "Docker",
    category: "Containers",
    worlds: ["Docker"],
    type: "technology",
    correct: [
      "Dockerfile",
      "Image",
      "Container",
      "Layer",
      "Volume",
      "Registry",
      "BuildKit",
      "Compose",
      "Network",
      "Bind mount",
      "ENTRYPOINT",
      "CMD",
      "Healthcheck",
      "Multi-stage build",
      "docker run",
      "docker build"
    ],
    distractors: {
      beginner: ["Terraform", "PromQL", "Route53", "Deployment", "Vault policy"],
      intermediate: ["containerd", "CRI-O", "Podman", "OCI runtime", "Kubernetes Service"],
      advanced: ["imagePullPolicy", "initContainer", "volumeClaimTemplates", "PodSecurityContext"],
      expert: ["readinessProbe", "podAffinity", "ClusterIP", "rollout undo", "desired count"]
    }
  },
  {
    id: "dockerfile",
    target: "Dockerfile Instructions",
    category: "Containers",
    worlds: ["Docker"],
    type: "command",
    correct: ["FROM", "RUN", "COPY", "ADD", "WORKDIR", "ENTRYPOINT", "CMD", "ARG", "ENV", "EXPOSE", "USER", "LABEL", "VOLUME", "HEALTHCHECK", "SHELL", "STOPSIGNAL"],
    distractors: {
      beginner: ["apiVersion", "kind", "metadata", "spec", "provider"],
      intermediate: ["script", "stage", "job", "steps", "before_script"],
      advanced: ["initContainers", "imagePullSecrets", "securityContext", "resources"],
      expert: ["lifecycle", "postStart", "preStop", "terminationGracePeriodSeconds"]
    }
  },
  {
    id: "kubernetes-services",
    target: "Kubernetes Services",
    category: "Kubernetes",
    worlds: ["Kubernetes"],
    type: "technology",
    correct: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName", "selector", "targetPort", "port", "endpoints", "EndpointSlice", "sessionAffinity", "externalTrafficPolicy", "internalTrafficPolicy"],
    distractors: {
      beginner: ["Dockerfile", "Terraform plan", "Jenkinsfile", "CloudFront", "PromQL"],
      intermediate: ["Ingress", "Deployment", "StatefulSet", "DaemonSet", "ConfigMap"],
      advanced: ["IngressClass", "NetworkPolicy", "ServiceMonitor", "Gateway API", "Headless Service"],
      expert: ["strategy", "maxSurge", "volumeClaimTemplates", "schedulerName", "revisionHistoryLimit"]
    }
  },
  {
    id: "kubernetes-scheduling",
    target: "Kubernetes Pod Scheduling",
    category: "Kubernetes",
    worlds: ["Kubernetes"],
    type: "technology",
    correct: ["nodeSelector", "nodeAffinity", "podAffinity", "podAntiAffinity", "tolerations", "taints", "topologySpreadConstraints", "schedulerName", "priorityClassName", "preemptionPolicy", "resource requests", "preferredDuringScheduling"],
    distractors: {
      beginner: ["S3 bucket", "Jenkins agent", "Terraform output", "Docker layer"],
      intermediate: ["Deployment", "Service", "ConfigMap", "Secret", "Ingress"],
      advanced: ["volumeClaimTemplates", "clusterIP", "IngressClass", "revisionHistoryLimit", "serviceName"],
      expert: ["terminationGracePeriodSeconds", "readinessProbe", "startupProbe", "imagePullPolicy", "rollingUpdate"]
    }
  },
  {
    id: "kubernetes-statefulset",
    target: "Kubernetes StatefulSet",
    category: "Kubernetes",
    worlds: ["Kubernetes"],
    type: "technology",
    correct: ["volumeClaimTemplates", "serviceName", "podManagementPolicy", "updateStrategy", "partition", "ordinals", "persistent identity", "stable network ID", "OrderedReady", "Parallel pod management", "controllerRevisionHash"],
    distractors: {
      beginner: ["Docker Compose", "Route53 record", "Prometheus alert", "Terraform backend"],
      intermediate: ["Deployment", "ReplicaSet", "DaemonSet", "Job", "CronJob"],
      advanced: ["strategy", "maxSurge", "maxUnavailable", "progressDeadlineSeconds", "revisionHistoryLimit"],
      expert: ["nodePort", "ingressClassName", "externalName", "topologyKeys", "subject kind"]
    }
  },
  {
    id: "kubernetes-networking",
    target: "Kubernetes Networking",
    category: "Kubernetes",
    worlds: ["Kubernetes", "Networking"],
    type: "technology",
    correct: ["Service", "Ingress", "NetworkPolicy", "CNI", "CoreDNS", "EndpointSlice", "ClusterIP", "NodePort", "LoadBalancer", "kube-proxy", "Gateway API", "ingressClassName", "targetPort", "pod CIDR"],
    distractors: {
      beginner: ["Dockerfile", "Jenkinsfile", "IAM role", "CloudWatch log group"],
      intermediate: ["Deployment", "StatefulSet", "DaemonSet", "ConfigMap", "PersistentVolume"],
      advanced: ["CSI driver", "schedulerName", "readinessProbe", "imagePullSecrets", "PodDisruptionBudget"],
      expert: ["maxUnavailable", "managedFields", "ownerReferences", "fsGroup", "restartPolicy"]
    }
  },
  {
    id: "kubernetes-troubleshooting",
    target: "CrashLoopBackOff Troubleshooting",
    category: "Kubernetes",
    worlds: ["Kubernetes", "SRE"],
    type: "troubleshooting",
    correct: ["kubectl logs", "kubectl describe pod", "previous logs", "livenessProbe", "readinessProbe", "OOMKilled", "Exit Code", "Events", "ImagePullBackOff", "ConfigMap mount", "Secret reference", "startupProbe", "resource limits"],
    distractors: {
      beginner: ["terraform init", "git merge", "Jenkins shared library", "S3 lifecycle"],
      intermediate: ["kubectl get svc", "kubectl cordon", "kubectl drain", "helm repo update"],
      advanced: ["endpointSlice", "podAffinity", "serviceAccountName", "nodeSelector"],
      expert: ["externalTrafficPolicy", "clusterIP", "volumeBindingMode", "serviceName"]
    }
  },
  {
    id: "terraform-lifecycle",
    target: "Terraform Lifecycle Meta Arguments",
    category: "Terraform",
    worlds: ["Terraform"],
    type: "technology",
    correct: ["create_before_destroy", "prevent_destroy", "ignore_changes", "replace_triggered_by", "precondition", "postcondition", "lifecycle block"],
    distractors: {
      beginner: ["kubectl apply", "Dockerfile", "Jenkinsfile", "Prometheus rule"],
      intermediate: ["count", "for_each", "depends_on", "provider", "providers", "locals"],
      advanced: ["moved block", "import block", "backend", "workspace", "dynamic block"],
      expert: ["sensitive", "nullable", "ephemeral", "validation", "source address"]
    }
  },
  {
    id: "terraform-state",
    target: "Terraform State Commands",
    category: "Terraform",
    worlds: ["Terraform"],
    type: "command",
    correct: ["terraform state list", "terraform state show", "terraform state mv", "terraform state rm", "terraform state pull", "terraform state push", "terraform import", "terraform refresh"],
    distractors: {
      beginner: ["kubectl get pods", "docker ps", "git status", "helm list"],
      intermediate: ["terraform plan", "terraform apply", "terraform fmt", "terraform validate"],
      advanced: ["terraform providers lock", "terraform force-unlock", "terraform workspace select", "terraform taint"],
      expert: ["terraform test", "terraform output -json", "terraform graph", "terraform providers mirror"]
    }
  },
  {
    id: "terraform-functions",
    target: "Terraform Collection Functions",
    category: "Terraform",
    worlds: ["Terraform"],
    type: "function",
    correct: ["concat", "flatten", "merge", "setproduct", "toset", "tolist", "tomap", "zipmap", "keys", "values", "lookup", "contains", "compact", "distinct", "length"],
    distractors: {
      beginner: ["kubectl", "docker", "helm", "git"],
      intermediate: ["file", "templatefile", "jsonencode", "yamldecode", "cidrsubnet"],
      advanced: ["count", "for_each", "depends_on", "lifecycle", "provider"],
      expert: ["can", "try", "sensitive", "nonsensitive", "one"]
    }
  },
  {
    id: "github-actions",
    target: "GitHub Actions Workflow Syntax",
    category: "CI/CD",
    worlds: ["GitHub", "GitHub Actions", "CI/CD"],
    type: "technology",
    correct: ["workflow_dispatch", "pull_request", "jobs", "steps", "runs-on", "uses", "with", "env", "secrets", "matrix", "needs", "permissions", "concurrency", "if", "checkout", "upload-artifact", "workflow_call"],
    distractors: {
      beginner: ["Docker volume", "Kubernetes Service", "Terraform state", "PromQL"],
      intermediate: ["Jenkins stage", "GitLab before_script", "Argo sync", "Tekton Task"],
      advanced: ["rules:changes", "parallel:matrix", "resource_group", "only:refs"],
      expert: ["post condition", "agent any", "archiveArtifacts", "allow_failure"]
    }
  },
  {
    id: "gitlab-ci",
    target: "GitLab CI",
    category: "CI/CD",
    worlds: ["GitLab CI", "CI/CD"],
    type: "technology",
    correct: ["stages", "job", "script", "before_script", "after_script", "rules", "only", "except", "needs", "artifacts", "cache", "variables", "environment", "resource_group", "include", "extends", "parallel:matrix"],
    distractors: {
      beginner: ["Jenkinsfile", "kubectl logs", "Terraform output", "Docker layer"],
      intermediate: ["workflow_dispatch", "runs-on", "uses", "with", "secrets"],
      advanced: ["Buildkite step", "CircleCI executor", "Tekton PipelineRun", "Argo Workflow"],
      expert: ["post always", "agent label", "when expression", "checkout action"]
    }
  },
  {
    id: "linux-process",
    target: "Linux Process Management",
    category: "Linux",
    worlds: ["Linux"],
    type: "command",
    correct: ["ps aux", "top", "htop", "pidof", "pgrep", "pkill", "kill -TERM", "kill -KILL", "nice", "renice", "systemctl status", "journalctl -u", "strace -p", "lsof -p", "cgroups"],
    distractors: {
      beginner: ["terraform plan", "docker build", "kubectl apply", "git push"],
      intermediate: ["ss -tulpn", "ip route", "dig", "traceroute"],
      advanced: ["iptables", "nftables", "tc qdisc", "conntrack"],
      expert: ["kubectl top pod", "nodeSelector", "podAntiAffinity", "livenessProbe"]
    }
  },
  {
    id: "linux-networking",
    target: "Linux Networking Commands",
    category: "Linux",
    worlds: ["Linux", "Networking"],
    type: "command",
    correct: ["ip addr", "ip route", "ss -tulpn", "curl -v", "dig", "nslookup", "traceroute", "tcpdump", "mtr", "iptables", "nft", "conntrack", "ethtool", "resolvectl", "nc -vz"],
    distractors: {
      beginner: ["git commit", "terraform init", "docker push", "helm lint"],
      intermediate: ["ps aux", "journalctl", "systemctl", "strace"],
      advanced: ["kubectl exec", "kubectl port-forward", "kubectl proxy", "kubectl cp"],
      expert: ["ExternalName", "EndpointSlice", "nodePort", "ingressClassName"]
    }
  },
  {
    id: "git-branching",
    target: "Git Branching",
    category: "Source Control",
    worlds: ["Git", "GitHub", "GitLab CI"],
    type: "technology",
    correct: ["git branch", "git checkout -b", "git switch -c", "git merge", "git rebase", "git cherry-pick", "git reflog", "merge conflict", "fast-forward", "detached HEAD", "remote tracking branch", "git push -u"],
    distractors: {
      beginner: ["Dockerfile", "Kubernetes Pod", "S3 bucket", "Prometheus alert"],
      intermediate: ["pull request", "merge queue", "CODEOWNERS", "protected branch"],
      advanced: ["terraform workspace", "kubectl rollout", "helm upgrade", "Jenkins stage"],
      expert: ["state mv", "ignore_changes", "ExternalName", "recording rule"]
    }
  },
  {
    id: "aws-compute",
    target: "AWS Compute Services",
    category: "AWS",
    worlds: ["AWS", "Cloud"],
    type: "cloud",
    correct: ["EC2", "Auto Scaling Group", "Lambda", "ECS", "EKS", "Fargate", "Elastic Beanstalk", "Batch", "Lightsail", "AMI", "Launch Template", "Spot Instance"],
    distractors: {
      beginner: ["Azure Blob Storage", "GCP Pub/Sub", "Kubernetes Service", "Terraform state"],
      intermediate: ["S3", "RDS", "DynamoDB", "Route53", "CloudFront"],
      advanced: ["Application Load Balancer", "Target Group", "NAT Gateway", "VPC Endpoint"],
      expert: ["EventBridge rule", "KMS key", "IAM policy", "CloudWatch metric stream"]
    }
  },
  {
    id: "aws-networking",
    target: "AWS Networking",
    category: "AWS",
    worlds: ["AWS", "Cloud", "Networking"],
    type: "cloud",
    correct: ["VPC", "Subnet", "Route Table", "Internet Gateway", "NAT Gateway", "Security Group", "NACL", "Transit Gateway", "VPC Peering", "PrivateLink", "Route53", "Elastic Load Balancing", "Target Group"],
    distractors: {
      beginner: ["Docker Image", "Jenkinsfile", "PromQL", "Git branch"],
      intermediate: ["EC2", "Lambda", "S3", "DynamoDB", "CloudWatch"],
      advanced: ["Azure VNet", "GCP VPC", "Kubernetes CNI", "Istio VirtualService"],
      expert: ["serviceName", "clusterIP", "volumeBindingMode", "lifecycle block"]
    }
  },
  {
    id: "aws-iam",
    target: "AWS IAM",
    category: "AWS",
    worlds: ["AWS", "Identity & Access", "Security"],
    type: "security",
    correct: ["IAM Role", "IAM Policy", "Principal", "Action", "Resource", "Condition", "Trust Policy", "AssumeRole", "Permission Boundary", "Instance Profile", "Service Control Policy", "OIDC Provider", "Least Privilege"],
    distractors: {
      beginner: ["Docker volume", "Grafana panel", "Terraform output", "Kubernetes Service"],
      intermediate: ["KMS key", "Secrets Manager", "Security Group", "CloudTrail"],
      advanced: ["Azure RBAC", "GCP IAM Binding", "Vault policy", "Kubernetes RoleBinding"],
      expert: ["NetworkPolicy", "PodSecurityContext", "OPA constraint", "SAML metadata"]
    }
  },
  {
    id: "azure-compute",
    target: "Azure Compute",
    category: "Azure",
    worlds: ["Azure", "Cloud"],
    type: "cloud",
    correct: ["Virtual Machines", "VM Scale Sets", "Azure Functions", "App Service", "AKS", "Container Apps", "Azure Batch", "Container Instances", "Availability Set", "Managed Disks"],
    distractors: {
      beginner: ["EC2", "Lambda", "GKE", "Dockerfile", "Prometheus"],
      intermediate: ["Blob Storage", "Cosmos DB", "Azure SQL", "Virtual Network"],
      advanced: ["Route Table", "Application Gateway", "Load Balancer", "NAT Gateway"],
      expert: ["service endpoint", "private endpoint", "managed identity", "key vault secret"]
    }
  },
  {
    id: "gcp-compute",
    target: "Google Cloud Compute",
    category: "Google Cloud",
    worlds: ["Google Cloud", "Cloud"],
    type: "cloud",
    correct: ["Compute Engine", "Managed Instance Group", "Cloud Run", "Cloud Functions", "GKE", "App Engine", "Cloud Batch", "Instance Template", "Spot VM", "Cloud Build worker pool"],
    distractors: {
      beginner: ["EC2", "Azure Functions", "Docker volume", "Jenkinsfile"],
      intermediate: ["Cloud Storage", "BigQuery", "Pub/Sub", "Cloud SQL"],
      advanced: ["VPC Connector", "Cloud NAT", "Load Balancing", "Cloud Armor"],
      expert: ["service account binding", "Workload Identity", "node pool", "NEG"]
    }
  },
  {
    id: "prometheus",
    target: "Prometheus Ecosystem",
    category: "Observability",
    worlds: ["Prometheus", "Observability"],
    type: "observability",
    correct: ["PromQL", "scrape target", "exporter", "Alertmanager", "recording rule", "alert rule", "ServiceMonitor", "Pushgateway", "TSDB", "remote_write", "label", "metric", "histogram", "counter", "gauge"],
    distractors: {
      beginner: ["Terraform plan", "Dockerfile", "Jenkinsfile", "Route53"],
      intermediate: ["Grafana", "OpenTelemetry", "Datadog", "Elastic", "Loki"],
      advanced: ["Jaeger span", "Tempo trace", "CloudWatch metric", "Sentry issue"],
      expert: ["ingressClassName", "targetPort", "IAM policy", "ignore_changes"]
    }
  },
  {
    id: "promql",
    target: "PromQL Functions",
    category: "Observability",
    worlds: ["Prometheus", "Observability"],
    type: "function",
    correct: ["rate", "irate", "increase", "sum by", "avg_over_time", "histogram_quantile", "label_replace", "topk", "bottomk", "count_over_time", "absent", "predict_linear", "clamp_max"],
    distractors: {
      beginner: ["concat", "flatten", "merge", "zipmap"],
      intermediate: ["where", "join", "stats", "eval", "bucket_script"],
      advanced: ["trace_id", "span_id", "service.name", "logfmt"],
      expert: ["for_each", "depends_on", "ignore_changes", "create_before_destroy"]
    }
  },
  {
    id: "grafana",
    target: "Grafana",
    category: "Observability",
    worlds: ["Grafana", "Observability"],
    type: "observability",
    correct: ["dashboard", "panel", "data source", "variable", "alert rule", "folder", "annotation", "Explore", "Loki", "Tempo", "Prometheus data source", "transform", "threshold", "provisioning"],
    distractors: {
      beginner: ["Docker layer", "Jenkins stage", "AWS subnet", "Terraform state"],
      intermediate: ["Alertmanager", "ServiceMonitor", "OpenTelemetry Collector", "Datadog monitor"],
      advanced: ["recording rule", "remote_write", "exemplar", "histogram bucket"],
      expert: ["maxSurge", "launch template", "OIDC provider", "git reflog"]
    }
  },
  {
    id: "opentelemetry",
    target: "OpenTelemetry",
    category: "Observability",
    worlds: ["OpenTelemetry", "Observability"],
    type: "observability",
    correct: ["Collector", "OTLP", "trace", "span", "metric", "log", "resource attributes", "instrumentation", "exporter", "receiver", "processor", "sampler", "context propagation", "Baggage"],
    distractors: {
      beginner: ["Dockerfile", "Terraform plan", "Git branch", "Kubernetes Service"],
      intermediate: ["PromQL", "Grafana panel", "Alertmanager", "Loki label"],
      advanced: ["remote_write", "recording rule", "ServiceMonitor", "histogram_quantile"],
      expert: ["initContainer", "podManagementPolicy", "trust policy", "cidrsubnet"]
    }
  },
  {
    id: "argocd",
    target: "Argo CD",
    category: "GitOps",
    worlds: ["Argo CD", "Kubernetes", "CI/CD"],
    type: "technology",
    correct: ["Application", "AppProject", "sync", "auto-sync", "self-heal", "prune", "desired state", "repo server", "application controller", "health status", "sync wave", "Kustomize source", "Helm source"],
    distractors: {
      beginner: ["Jenkins agent", "Terraform backend", "Docker image", "Route53"],
      intermediate: ["Flux Kustomization", "HelmRelease", "Tekton Pipeline", "GitHub workflow"],
      advanced: ["rollout strategy", "ReplicaSet", "StatefulSet partition", "DaemonSet"],
      expert: ["ignore_changes", "prevent_destroy", "resource_group", "workflow_call"]
    }
  },
  {
    id: "helm",
    target: "Helm Charts",
    category: "Kubernetes",
    worlds: ["Helm", "Kubernetes"],
    type: "technology",
    correct: ["Chart.yaml", "values.yaml", "templates", "helpers.tpl", "release", "helm install", "helm upgrade", "helm rollback", "helm template", "helm lint", "repository", "subchart", "Sprig functions"],
    distractors: {
      beginner: ["Jenkinsfile", "Docker Compose", "Terraform state", "PromQL"],
      intermediate: ["Kustomize patch", "Argo Application", "Flux HelmRelease", "kubectl apply"],
      advanced: ["ServiceMonitor", "GatewayClass", "NetworkPolicy", "PodDisruptionBudget"],
      expert: ["count", "for_each", "workflow_call", "parallel:matrix"]
    }
  },
  {
    id: "ansible",
    target: "Ansible Playbooks",
    category: "Automation",
    worlds: ["Ansible"],
    type: "technology",
    correct: ["playbook", "inventory", "role", "task", "handler", "module", "vars", "facts", "templates", "Jinja2", "become", "tags", "ansible-playbook", "group_vars", "host_vars"],
    distractors: {
      beginner: ["Dockerfile", "Kubernetes Pod", "Terraform plan", "PromQL"],
      intermediate: ["cloud-init", "Packer template", "Chef recipe", "Puppet manifest"],
      advanced: ["Helm chart", "Kustomization", "Jenkins shared library", "GitHub action"],
      expert: ["lifecycle", "ServiceMonitor", "podAntiAffinity", "permission boundary"]
    }
  },
  {
    id: "vault",
    target: "Vault Secret Management",
    category: "Security",
    worlds: ["Vault", "Secrets Management", "Security"],
    type: "security",
    correct: ["KV secrets engine", "dynamic secrets", "policy", "token", "AppRole", "Transit engine", "lease", "renewal", "revocation", "seal", "unseal", "audit device", "Vault Agent", "namespaces"],
    distractors: {
      beginner: ["Docker image", "Kubernetes Service", "Terraform output", "Grafana dashboard"],
      intermediate: ["AWS Secrets Manager", "Azure Key Vault", "GCP Secret Manager", "Sealed Secrets"],
      advanced: ["External Secrets Operator", "KMS key", "OIDC provider", "IAM role"],
      expert: ["PodSecurityPolicy", "NetworkPolicy", "OPA Constraint", "SBOM"]
    }
  },
  {
    id: "tls",
    target: "TLS",
    category: "Security",
    worlds: ["TLS", "Security", "Networking"],
    type: "security",
    correct: ["certificate", "private key", "CA", "SAN", "SNI", "cipher suite", "handshake", "mTLS", "OCSP", "CRL", "chain of trust", "TLS termination", "openssl s_client"],
    distractors: {
      beginner: ["Docker layer", "Jenkins stage", "Terraform state", "Grafana panel"],
      intermediate: ["DNS A record", "Route53 zone", "Ingress", "Load Balancer"],
      advanced: ["JWT", "OIDC", "SAML", "IAM trust policy"],
      expert: ["EndpointSlice", "ServiceMonitor", "workflow_call", "ignore_changes"]
    }
  },
  {
    id: "dns",
    target: "DNS",
    category: "Networking",
    worlds: ["DNS", "Networking", "Cloudflare"],
    type: "technology",
    correct: ["A record", "AAAA record", "CNAME", "MX record", "TXT record", "NS record", "SOA", "TTL", "zone", "resolver", "authoritative server", "dig", "nslookup", "DNSSEC", "wildcard record"],
    distractors: {
      beginner: ["Dockerfile", "Jenkinsfile", "Terraform output", "PromQL"],
      intermediate: ["Route53", "Cloudflare", "CoreDNS", "ExternalDNS"],
      advanced: ["Ingress", "Load Balancer", "SNI", "certificate SAN"],
      expert: ["endpointSlice", "serviceName", "recording rule", "state rm"]
    }
  },
  {
    id: "nginx",
    target: "NGINX Reverse Proxy",
    category: "Networking",
    worlds: ["NGINX", "Networking"],
    type: "technology",
    correct: ["server block", "location", "proxy_pass", "upstream", "listen", "server_name", "rewrite", "proxy_set_header", "ssl_certificate", "access_log", "error_log", "load balancing", "health_check"],
    distractors: {
      beginner: ["Terraform state", "Kubernetes pod", "Git branch", "Grafana panel"],
      intermediate: ["Ingress controller", "Envoy", "HAProxy", "API Gateway"],
      advanced: ["VirtualService", "DestinationRule", "GatewayClass", "ServiceMonitor"],
      expert: ["count", "withCredentials", "archiveArtifacts", "podManagementPolicy"]
    }
  },
  {
    id: "istio",
    target: "Istio Traffic Management",
    category: "Service Mesh",
    worlds: ["Istio", "Service Mesh", "Kubernetes"],
    type: "technology",
    correct: ["VirtualService", "DestinationRule", "Gateway", "ServiceEntry", "sidecar proxy", "Envoy", "mTLS", "traffic split", "fault injection", "retry policy", "timeout", "subset", "PeerAuthentication"],
    distractors: {
      beginner: ["Jenkinsfile", "Terraform backend", "Docker volume", "Git tag"],
      intermediate: ["Kubernetes Service", "Ingress", "NetworkPolicy", "Gateway API"],
      advanced: ["ServiceMonitor", "PodDisruptionBudget", "EndpointSlice", "CoreDNS"],
      expert: ["create_before_destroy", "workflow_dispatch", "parallel:matrix", "volumeClaimTemplates"]
    }
  },
  {
    id: "sre-incident",
    target: "SRE Incident Response",
    category: "SRE",
    worlds: ["SRE", "Incident Response"],
    type: "troubleshooting",
    correct: ["severity", "impact", "incident commander", "timeline", "mitigation", "rollback", "status page", "postmortem", "runbook", "error budget", "SLO burn rate", "on-call escalation", "blameless review"],
    distractors: {
      beginner: ["Dockerfile", "Terraform module", "Git branch", "Helm chart"],
      intermediate: ["alert rule", "dashboard", "log query", "trace"],
      advanced: ["change failure rate", "MTTR", "canary deployment", "feature flag"],
      expert: ["volumeClaimTemplates", "terraform state mv", "workflow_call", "NACL"]
    }
  },
  {
    id: "platform-engineering",
    target: "Platform Engineering",
    category: "Platform Engineering",
    worlds: ["Platform Engineering"],
    type: "architecture",
    correct: ["internal developer platform", "golden path", "self-service", "service catalog", "scorecard", "Backstage", "templates", "guardrails", "developer portal", "paved road", "platform API", "reusable workflow", "developer experience"],
    distractors: {
      beginner: ["Docker layer", "DNS TTL", "Linux process", "PromQL rate"],
      intermediate: ["Kubernetes", "Terraform", "GitHub Actions", "Argo CD"],
      advanced: ["SLO", "policy as code", "OIDC federation", "secret rotation"],
      expert: ["EndpointSlice", "label_replace", "create_before_destroy", "nodeAffinity"]
    }
  },
  {
    id: "devsecops",
    target: "DevSecOps Scanning",
    category: "DevSecOps",
    worlds: ["DevSecOps", "Security", "Trivy", "Snyk", "SonarQube", "OPA"],
    type: "security",
    correct: ["SAST", "DAST", "SCA", "SBOM", "container scan", "image vulnerability", "CVE", "policy as code", "secret scanning", "IaC scanning", "Trivy", "Snyk", "SonarQube", "OPA", "Conftest"],
    distractors: {
      beginner: ["Kubernetes Service", "Terraform output", "Grafana panel", "Git branch"],
      intermediate: ["dependency review", "CodeQL", "admission controller", "signed image"],
      advanced: ["cosign", "provenance", "SLSA", "attestation"],
      expert: ["volumeBindingMode", "recording rule", "AssumeRole", "proxy_pass"]
    }
  },
  {
    id: "cicd-concepts",
    target: "CI/CD Concepts",
    category: "CI/CD",
    worlds: ["CI/CD"],
    type: "architecture",
    correct: ["pipeline", "build", "test", "artifact", "deployment", "rollback", "approval gate", "environment", "runner", "agent", "release", "canary", "blue-green", "feature flag", "promotion"],
    distractors: {
      beginner: ["Pod CIDR", "VPC", "DNS TXT", "PromQL"],
      intermediate: ["Jenkins", "GitHub Actions", "GitLab CI", "Azure DevOps"],
      advanced: ["Argo Rollouts", "progressive delivery", "supply chain security", "cache key"],
      expert: ["state lock", "nodeAffinity", "Transit Gateway", "label_replace"]
    }
  },
  {
    id: "kubernetes-storage",
    target: "Kubernetes Storage",
    category: "Kubernetes",
    worlds: ["Kubernetes"],
    type: "technology",
    correct: ["PersistentVolume", "PersistentVolumeClaim", "StorageClass", "CSI driver", "accessModes", "volumeMode", "reclaimPolicy", "volumeBindingMode", "allowVolumeExpansion", "emptyDir", "hostPath", "projected volume"],
    distractors: {
      beginner: ["Jenkinsfile", "Git rebase", "Route53", "PromQL"],
      intermediate: ["ConfigMap", "Secret", "StatefulSet", "Deployment"],
      advanced: ["volumeClaimTemplates", "podManagementPolicy", "topologySpreadConstraints", "nodeAffinity"],
      expert: ["clusterIP", "externalTrafficPolicy", "workflow_call", "ignore_changes"]
    }
  },
  {
    id: "kubernetes-rbac",
    target: "Kubernetes RBAC",
    category: "Kubernetes",
    worlds: ["Kubernetes", "Identity & Access", "Security"],
    type: "security",
    correct: ["Role", "ClusterRole", "RoleBinding", "ClusterRoleBinding", "ServiceAccount", "verbs", "resources", "apiGroups", "subjects", "namespace", "least privilege", "impersonate"],
    distractors: {
      beginner: ["Dockerfile", "Jenkins stage", "Terraform output", "Grafana dashboard"],
      intermediate: ["PodSecurity", "NetworkPolicy", "Secret", "ConfigMap"],
      advanced: ["AWS IAM Role", "OIDC federation", "Vault policy", "OPA constraint"],
      expert: ["IngressClass", "EndpointSlice", "StatefulSet ordinals", "metric label"]
    }
  },
  {
    id: "kubernetes-workloads",
    target: "Kubernetes Workloads",
    category: "Kubernetes",
    worlds: ["Kubernetes"],
    type: "technology",
    correct: ["Pod", "Deployment", "ReplicaSet", "StatefulSet", "DaemonSet", "Job", "CronJob", "controller", "restartPolicy", "replicas", "rollout", "pod template"],
    distractors: {
      beginner: ["Dockerfile", "Git branch", "Terraform state", "CloudWatch log"],
      intermediate: ["Service", "Ingress", "ConfigMap", "Secret", "PersistentVolume"],
      advanced: ["GatewayClass", "ServiceMonitor", "NetworkPolicy", "StorageClass"],
      expert: ["route table", "permission boundary", "recording rule", "workflow_call"]
    }
  },
  {
    id: "cloudflare-edge",
    target: "Cloudflare Edge",
    category: "Cloudflare",
    worlds: ["Cloudflare", "Networking"],
    type: "cloud",
    correct: ["DNS proxy", "Workers", "Pages", "WAF", "DDoS protection", "Ruleset", "Cache Rules", "Turnstile", "R2", "KV", "Durable Objects", "Zero Trust", "Argo Smart Routing"],
    distractors: {
      beginner: ["Jenkinsfile", "Docker layer", "Kubernetes Pod", "Terraform state"],
      intermediate: ["Route53", "CloudFront", "Azure Front Door", "GCP Cloud CDN"],
      advanced: ["Load Balancer", "TLS certificate", "CNAME flattening", "DNSSEC"],
      expert: ["volumeClaimTemplates", "ServiceMonitor", "workflow_call", "podAffinity"]
    }
  },
  {
    id: "databases-ops",
    target: "Database Operations",
    category: "Databases",
    worlds: ["Databases", "SRE"],
    type: "architecture",
    correct: ["backup", "restore", "replication", "failover", "read replica", "connection pool", "migration", "index", "vacuum", "point-in-time recovery", "high availability", "sharding", "maintenance window"],
    distractors: {
      beginner: ["Dockerfile", "Git branch", "Jenkins stage", "Kubernetes Service"],
      intermediate: ["RDS", "Cloud SQL", "Azure SQL", "DynamoDB"],
      advanced: ["Prometheus exporter", "slow query log", "WAL", "binlog"],
      expert: ["nodeSelector", "targetPort", "state mv", "workflow_dispatch"]
    }
  },
  {
    id: "messaging",
    target: "Messaging Systems",
    category: "Messaging",
    worlds: ["Messaging", "Architecture"],
    type: "architecture",
    correct: ["queue", "topic", "consumer group", "partition", "offset", "dead-letter queue", "retry", "backpressure", "Kafka", "RabbitMQ", "SQS", "SNS", "Pub/Sub", "event bus"],
    distractors: {
      beginner: ["Docker layer", "Terraform state", "Jenkinsfile", "DNS TTL"],
      intermediate: ["EventBridge", "Kinesis", "Azure Service Bus", "NATS"],
      advanced: ["idempotency", "ordering key", "at-least-once", "exactly-once"],
      expert: ["ClusterIP", "role binding", "proxy_pass", "histogram_quantile"]
    }
  },
  {
    id: "mlops",
    target: "MLOps Infrastructure",
    category: "MLOps",
    worlds: ["MLOps", "AI Infrastructure"],
    type: "architecture",
    correct: ["feature store", "model registry", "training job", "inference endpoint", "GPU node pool", "batch inference", "experiment tracking", "data drift", "model monitoring", "vector database", "ML pipeline", "artifact store"],
    distractors: {
      beginner: ["Jenkins stage", "Docker volume", "DNS record", "Terraform state"],
      intermediate: ["Kubeflow", "MLflow", "SageMaker", "Vertex AI"],
      advanced: ["KServe", "Ray", "NVIDIA device plugin", "HPA"],
      expert: ["EndpointSlice", "ignore_changes", "recording rule", "permission boundary"]
    }
  },
  {
    id: "finops",
    target: "FinOps",
    category: "FinOps",
    worlds: ["FinOps", "Cloud"],
    type: "architecture",
    correct: ["cost allocation", "tagging", "showback", "chargeback", "rightsizing", "reserved instances", "savings plans", "spot usage", "unit economics", "budget alert", "forecast", "idle resource", "commitment discount"],
    distractors: {
      beginner: ["Kubernetes Pod", "Jenkinsfile", "Git branch", "PromQL"],
      intermediate: ["AWS Cost Explorer", "Azure Cost Management", "GCP Billing", "Kubecost"],
      advanced: ["node autoscaling", "storage lifecycle", "egress cost", "waste report"],
      expert: ["podAntiAffinity", "withCredentials", "terraform import", "label_replace"]
    }
  },
  {
    id: "api-gateway",
    target: "API Gateway",
    category: "Networking",
    worlds: ["API Gateway", "Networking"],
    type: "architecture",
    correct: ["routing", "rate limiting", "authentication", "authorization", "request transform", "response transform", "upstream", "path match", "header match", "JWT validation", "API key", "circuit breaker", "Kong", "AWS API Gateway"],
    distractors: {
      beginner: ["Dockerfile", "Terraform state", "Grafana dashboard", "Git branch"],
      intermediate: ["NGINX", "Envoy", "Ingress", "Service Mesh"],
      advanced: ["Gateway API", "VirtualService", "Load Balancer", "CloudFront"],
      expert: ["volumeClaimTemplates", "recording rule", "state list", "workflow_call"]
    }
  }
];

export const WORLDS = [
  "Linux",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "AWS",
  "Azure",
  "Google Cloud",
  "Helm",
  "Argo CD",
  "Flux",
  "Ansible",
  "Prometheus",
  "Grafana",
  "Datadog",
  "OpenTelemetry",
  "Elastic",
  "Istio",
  "NGINX",
  "Vault",
  "Cloudflare",
  "SonarQube",
  "Trivy",
  "Snyk",
  "OPA",
  "Networking",
  "DNS",
  "TLS",
  "DevSecOps",
  "SRE",
  "Platform Engineering",
  "FinOps",
  "MLOps",
  "AI Infrastructure",
  "Databases",
  "Messaging",
  "Service Mesh",
  "API Gateway",
  "Secrets Management",
  "Identity & Access"
];

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function hashSeed(input) {
  const text = String(input);
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createRng(seed = Date.now()) {
  let t = typeof seed === "number" ? seed >>> 0 : hashSeed(seed);
  return function rng() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick(rng, list) {
  return list[Math.floor(rng() * list.length) % list.length];
}

export function shuffle(rng, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createVisualVariant(rng) {
  const palette = pick(rng, BUBBLE_PALETTE);
  const neighbor = pick(rng, BUBBLE_PALETTE);
  return {
    name: palette.name,
    fillA: palette.a,
    fillB: rng() > 0.45 ? palette.b : neighbor.b,
    shine: palette.c,
    fillAlphaA: 0.36 + rng() * 0.14,
    fillAlphaB: 0.26 + rng() * 0.12,
    borderAlpha: 0.28 + rng() * 0.24,
    glowAlpha: 0.16 + rng() * 0.16,
    highlight: 0.35 + rng() * 0.26
  };
}

function baseTotalForLevel(level) {
  return Math.max(0, Number(level) || 1) - 1;
}

function totalBudgetForLevel(base, level) {
  const progress = baseTotalForLevel(level);
  return Math.round(base.totalFloor + Math.pow(progress, 1.18) * base.totalMultiplier);
}

function settingsForLevel(base, level, mode) {
  const progress = baseTotalForLevel(level);
  const difficultyRank = ["beginner", "intermediate", "advanced", "expert"].indexOf(base.id);
  const rank = Math.max(0, difficultyRank);
  const speedScale = 1 + Math.min(1.25, progress * (0.006 + rank * 0.0018));
  const spawnScale = 1 + Math.min(1.6, progress * (0.012 + rank * 0.0025));
  const activeScale = 1 + Math.min(2.1, progress * (0.018 + rank * 0.003));
  const survivalBoost = mode === "survival" ? 1.08 : 1;
  const speedMin = Math.round(base.fallSpeed[0] * speedScale * survivalBoost);
  const speedMax = Math.round(base.fallSpeed[1] * speedScale * survivalBoost);

  return {
    ...base,
    spawnPerSecond: round(base.spawnPerSecond * spawnScale * survivalBoost, 2),
    maxActive: Math.round(base.maxActive * activeScale),
    fallSpeed: [speedMin, speedMax],
    waveCount: Math.min(7, base.waveCount + Math.floor(progress / 18))
  };
}

export function buildLevelSession({
  mode = "quick",
  difficulty = "beginner",
  level = 1,
  world = "",
  seed = Date.now()
} = {}) {
  const base = DIFFICULTIES[difficulty] || DIFFICULTIES.beginner;
  const settings = settingsForLevel(base, level, mode);
  const rng = createRng(`${seed}:${mode}:${difficulty}:${level}:${world}`);
  let totalBudget = totalBudgetForLevel(base, level);
  let waveCount = settings.waveCount;
  let timeLimit = 0;
  let isBoss = mode === "boss" || (mode === "quick" && level > 0 && level % 10 === 0);

  if (mode === "daily") {
    totalBudget = Math.round(totalBudget * 1.15);
    waveCount += 1;
  }

  if (mode === "speed") {
    totalBudget = Math.round(totalBudget * 1.45);
    timeLimit = 60;
    waveCount += 1;
  }

  if (mode === "survival") {
    totalBudget = Infinity;
    waveCount = Infinity;
  }

  if (isBoss) {
    totalBudget = Number.isFinite(totalBudget) ? Math.round(totalBudget * 1.25) : totalBudget;
    waveCount = Math.max(3, Math.min(8, settings.waveCount + 1));
  }

  const availableTargets = selectTargets({ mode, world, rng, count: Number.isFinite(waveCount) ? waveCount : 8 });
  const waves = buildWaves({
    rng,
    totalBudget,
    waveCount,
    correctDensity: settings.correctDensity,
    targets: availableTargets
  });

  return {
    mode,
    difficulty,
    level,
    world,
    seed,
    isBoss,
    timeLimit,
    totalBudget,
    waveCount,
    settings,
    waves,
    bossHealth: isBoss ? Math.round(totalCorrectForWaves(waves) * 95 * settings.scoreMultiplier) : 0
  };
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function totalCorrectForWaves(waves) {
  return waves.reduce((sum, wave) => sum + wave.correctTotal, 0);
}

export function buildWaves({ rng, totalBudget, waveCount, correctDensity, targets }) {
  if (!Number.isFinite(totalBudget)) {
    const survivalTargets = shuffle(rng, targets.length ? targets : KNOWLEDGE_BASE).slice(0, 8);
    return survivalTargets.map((target, index) => ({
      id: `survival-${index + 1}`,
      index,
      target,
      budget: 220 + index * 25,
      spawned: 0,
      correctSpawned: 0,
      correctTotal: Math.round((220 + index * 25) * correctDensity)
    }));
  }

  const count = Math.max(1, Math.min(waveCount, totalBudget));
  const waves = [];
  let remaining = totalBudget;
  for (let i = 0; i < count; i += 1) {
    const slotsLeft = count - i;
    const budget = i === count - 1 ? remaining : Math.max(1, Math.round(totalBudget / count + (rng() - 0.5) * totalBudget * 0.035));
    remaining -= budget;
    const target = targets[i % targets.length] || pick(rng, KNOWLEDGE_BASE);
    waves.push({
      id: `${target.id}-${i + 1}`,
      index: i,
      target,
      budget: Math.max(slotsLeft === 1 ? remaining + budget : budget, 1),
      spawned: 0,
      correctSpawned: 0,
      correctTotal: Math.max(1, Math.round(Math.max(slotsLeft === 1 ? remaining + budget : budget, 1) * correctDensity))
    });
  }
  return waves;
}

export function selectTargets({ mode = "quick", world = "", rng = Math.random, count = 4 } = {}) {
  let pool = KNOWLEDGE_BASE;
  if (world) {
    const normalized = world.toLowerCase();
    pool = pool.filter((target) => target.worlds.some((item) => item.toLowerCase() === normalized));
  }
  if (mode === "command") {
    pool = pool.filter((target) => target.type === "command");
  }
  if (mode === "cloud") {
    pool = pool.filter((target) => ["AWS", "Azure", "Google Cloud", "Cloudflare"].includes(target.category) || target.worlds.includes("Cloud"));
  }
  if (mode === "incident") {
    pool = pool.filter((target) => target.type === "troubleshooting" || target.worlds.includes("SRE"));
  }
  if (!pool.length) pool = KNOWLEDGE_BASE;
  return shuffle(rng, pool).slice(0, Math.max(1, Math.min(count, pool.length)));
}

export function buildDistractorPool(target, semanticLevel = 0) {
  const correctSet = new Set(target.correct.map((item) => item.toLowerCase()));
  const tiers = target.distractors || {};
  const own = [
    ...(tiers.beginner || []),
    ...(semanticLevel >= 1 ? tiers.intermediate || [] : []),
    ...(semanticLevel >= 2 ? tiers.advanced || [] : []),
    ...(semanticLevel >= 3 ? tiers.expert || [] : [])
  ];
  const related = KNOWLEDGE_BASE
    .filter((item) => item.id !== target.id && (item.category === target.category || item.worlds.some((world) => target.worlds.includes(world))))
    .flatMap((item) => item.correct)
    .slice(0, semanticLevel >= 2 ? 90 : 36);
  const unrelated = KNOWLEDGE_BASE
    .filter((item) => item.id !== target.id && item.category !== target.category)
    .flatMap((item) => item.correct)
    .slice(0, semanticLevel === 0 ? 140 : 45);
  const commands = target.type === "command" || semanticLevel >= 2 ? commandDistractors : [];
  return [...new Set([...own, ...related, ...unrelated, ...commands])].filter(
    (item) => !correctSet.has(String(item).toLowerCase())
  );
}

export function rankForXp(xp) {
  let current = RANKS[0][0];
  for (const [rank, threshold] of RANKS) {
    if (xp >= threshold) current = rank;
  }
  return current;
}

export function dailySeed(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `daily-${yyyy}-${mm}-${dd}`;
}
