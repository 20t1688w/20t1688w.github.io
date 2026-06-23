// ============================================================
// gameUtils.js  ─  乱数・計算・セーブ・ロード
// ============================================================

const rand      = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const calcPhys  = (atk, def) => Math.max(1, atk - Math.floor(def * .5) + rand(-6, 6));
const calcSkill = (atk, mult, def) => Math.max(1, Math.floor(atk * mult) + rand(-8, 8) - Math.floor(def * .3));
const wait      = ms => new Promise(r => setTimeout(r, ms));
const SAVE_KEY  = "natsumiRPG_v2";

function fmtDate(ts) {
  const d = new Date(ts);
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function saveGame(data) {
  const json = JSON.stringify({ ...data, savedAt: Date.now() });
  try { localStorage.setItem(SAVE_KEY, json); } catch {}
  try {
    const blob = new Blob([json], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "natsumi_save.json";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch {}
}

function loadGame() {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

function loadGameFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => { try { resolve(JSON.parse(e.target.result)); } catch { reject(); } };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
