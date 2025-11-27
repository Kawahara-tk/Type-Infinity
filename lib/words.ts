export const words = [
  "algorithm", "backend", "bandwidth", "binary", "browser", "bug", "cache", "cloud", "code", "compiler",
  "compress", "computer", "connect", "cookie", "cyber", "data", "debug", "device", "digital", "disk",
  "domain", "download", "driver", "email", "encrypt", "engine", "error", "file", "firewall", "folder",
  "font", "format", "frame", "function", "gateway", "gigabyte", "graphic", "hack", "hardware", "host",
  "html", "icon", "image", "index", "input", "install", "internet", "java", "kernel", "keyboard",
  "laptop", "layer", "link", "linux", "logic", "login", "loop", "malware", "media", "memory",
  "modem", "monitor", "mouse", "network", "node", "offline", "online", "open", "output", "packet",
  "panel", "patch", "path", "pixel", "platform", "plugin", "port", "power", "print", "process",
  "program", "protocol", "query", "queue", "random", "router", "script", "search", "secure", "server",
  "shell", "signal", "socket", "software", "source", "spam", "stack", "status", "store", "stream",
  "system", "table", "task", "tech", "text", "token", "tool", "traffic", "type", "unit",
  "upload", "user", "value", "video", "virus", "web", "wifi", "window", "wire", "world",
  "react", "vue", "angular", "svelte", "next", "nuxt", "node", "deno", "bun", "python",
  "rust", "go", "swift", "kotlin", "java", "csharp", "php", "ruby", "perl", "scala",
  "docker", "kubernetes", "aws", "azure", "gcp", "vercel", "netlify", "heroku", "firebase", "supabase",
  "git", "github", "gitlab", "bitbucket", "jira", "trello", "slack", "discord", "zoom", "teams",
  "vscode", "vim", "emacs", "sublime", "atom", "intellij", "eclipse", "xcode", "android", "ios",
  "windows", "macos", "linux", "ubuntu", "debian", "fedora", "centos", "arch", "gentoo", "kali"
];

export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
