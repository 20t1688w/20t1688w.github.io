// ============================================================
// components.js  ─  共通UIコンポーネント（BabelでJSX変換前提）
// ============================================================
// ※ このファイルはgame.htmlにインラインで読み込まれるため、
//    実際にはgame.htmlの <script type="text/babel"> 内に埋め込む。
//    このファイルは構造整理のための参照用。

// ─── StatusBar ───────────────────────────────────────────────
// props: current, max, type="hp"|"mp", label
const StatusBar = ({ current, max, type = "hp", label }) => {
  const pct  = Math.max(0, Math.min(100, (current / max) * 100));
  const grad = type === "mp"
    ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
    : pct > 50 ? "linear-gradient(90deg,#22c55e,#4ade80)"
    : pct > 25 ? "linear-gradient(90deg,#eab308,#facc15)"
    :             "linear-gradient(90deg,#ef4444,#f87171)";
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>
        <span style={{ color: type === "mp" ? "#60a5fa" : "#94a3b8" }}>{label || (type === "hp" ? "HP" : "MP")}</span>
        <span style={{ fontWeight: "bold", color: type === "hp" && pct < 25 ? "#f87171" : "#e2e8f0" }}>{current} / {max}</span>
      </div>
      <div style={{ height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden", border: "1px solid #334155" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: grad, borderRadius: 4, transition: "width .35s ease" }} />
      </div>
    </div>
  );
};

// ─── EnemyArea（敵HPバー） ────────────────────────────────────
const EnemyArea = ({ enemy }) => (
  <div style={{ padding: "6px 12px 4px", flexShrink: 0 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ color: "#f1f5f9", fontSize: 14, fontWeight: "bold" }}>{enemy.name}</span>
        {enemy.boss  && <span style={{ background: "#dc2626", color: "#fff", fontSize: 9, padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }}>BOSS</span>}
        {enemy.bonus && <span style={{ background: "#d97706", color: "#fff", fontSize: 9, padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }}>BONUS</span>}
      </div>
      <span style={{ color: "#475569", fontSize: 10 }}>第{enemy.chapter}章</span>
    </div>
    <StatusBar current={enemy.hp} max={enemy.maxHp} label="敵HP" />
  </div>
);

// ─── EnemyGraphic ─────────────────────────────────────────────
const EnemyGraphic = ({ enemy, shaking, flashing }) => (
  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
    <div
      className={`${enemy.boss ? "boss-glow " : ""}${!shaking ? "enemy-float" : ""}`}
      style={{
        width: 112, height: 112,
        background: `linear-gradient(135deg,${enemy.bgColor},#05050f)`,
        border: `2px solid ${enemy.borderColor}`,
        borderRadius: 18,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        animation: shaking ? "shake .35s ease" : undefined,
        opacity: flashing ? .25 : 1,
        transition: "opacity .06s",
        boxShadow: `0 4px 16px ${enemy.borderColor}44`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%,${enemy.borderColor}22,transparent 70%)`, pointerEvents: "none" }} />
      <span style={{ fontSize: 46, lineHeight: 1, filter: flashing ? "brightness(3)" : "none" }}>{enemy.emoji}</span>
      <span style={{ fontSize: 9, color: "#64748b", textAlign: "center", padding: "0 6px", lineHeight: 1.3 }}>{enemy.description}</span>
    </div>
  </div>
);

// ─── PlayerStatus（HPバー2人分） ──────────────────────────────
const PlayerStatus = ({ player, partner }) => (
  <div style={{
    padding: "4px 10px 6px",
    background: "linear-gradient(to top,#05050f 60%,transparent)",
    borderTop: "1px solid #1e293b",
    flexShrink: 0,
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px",
  }}>
    {/* Natsumi */}
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 16 }}>👩</span>
        <span style={{ color: "#f1f5f9", fontSize: 12, fontWeight: "bold" }}>{player.name}</span>
        <span style={{ color: "#475569", fontSize: 10 }}>Lv.{player.level}</span>
      </div>
      <StatusBar current={player.hp} max={player.maxHp} type="hp" />
      <StatusBar current={player.mp} max={player.maxMp} type="mp" />
    </div>
    {/* Masaya */}
    <div style={{ opacity: partner.ko ? .45 : 1, transition: "opacity .3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 16 }}>👨</span>
        <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: "bold" }}>{partner.name}</span>
        <span style={{ color: "#475569", fontSize: 10 }}>Lv.{partner.level}</span>
        {partner.ko && <span style={{ background: "#7f1d1d", color: "#fca5a5", fontSize: 9, padding: "1px 3px", borderRadius: 3, fontWeight: "bold" }}>KO</span>}
      </div>
      {/* ★ MP も StatusBar で正しく表示 */}
      <StatusBar current={partner.hp}  max={partner.maxHp}  type="hp" />
      <StatusBar current={partner.mp}  max={partner.maxMp}  type="mp" />
    </div>
  </div>
);

// ─── BattleLog ────────────────────────────────────────────────
const BattleLog = ({ logs, logRef }) => {
  const STYLE = {
    damage: { color: "#f87171", icon: "⚔️" },
    heal:   { color: "#4ade80", icon: "💚" },
    skill:  { color: "#c084fc", icon: "✨" },
    system: { color: "#fbbf24", icon: "📢" },
    normal: { color: "#e2e8f0", icon: "▶" },
  };
  return (
    <div ref={logRef} style={{ flex: "0 0 76px", overflowY: "auto", padding: "5px 10px", background: "#080810", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }}>
      {logs.map((log, i) => {
        const s = STYLE[log.type] || STYLE.normal;
        return (
          <div key={i} className="log-entry" style={{ padding: "2px 0", color: s.color, fontSize: 12, lineHeight: 1.5, display: "flex", gap: 4 }}>
            <span style={{ flexShrink: 0, fontSize: 10 }}>{s.icon}</span>
            <span>{log.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── CommandButtons ───────────────────────────────────────────
const CommandButtons = ({ onFight, onSkill, onItem, onSave, onTitle, disabled }) => {
  const Btn = ({ label, emoji, onClick, grad, shadow, col, row, small }) => (
    <button onClick={onClick} disabled={disabled} style={{
      gridColumn: col, gridRow: row,
      background: disabled ? "#1e293b" : grad,
      border: "none", borderRadius: small ? 8 : 12,
      color: disabled ? "#475569" : "#fff",
      fontWeight: "bold", cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
      boxShadow: disabled ? "none" : shadow,
      fontSize: small ? 11 : 14,
      WebkitTapHighlightColor: "transparent",
      transition: "opacity .15s",
    }}>
      <span style={{ fontSize: small ? 14 : 22 }}>{emoji}</span>
      <span>{label}</span>
    </button>
  );
  return (
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 36px", gap: 6, padding: "6px 10px 8px", background: "#0c0c1a" }}>
      <Btn label="たたかう" emoji="⚔️" onClick={onFight} col="1" row="1 / 3"
        grad="linear-gradient(135deg,#dc2626,#b91c1c)" shadow="0 4px 12px rgba(220,38,38,.45)" />
      <Btn label="スキル"   emoji="✨" onClick={onSkill} col="2" row="1"
        grad="linear-gradient(135deg,#7c3aed,#6d28d9)" shadow="0 4px 12px rgba(124,58,237,.4)" />
      <Btn label="アイテム" emoji="🎒" onClick={onItem}  col="2" row="2"
        grad="linear-gradient(135deg,#059669,#047857)" shadow="0 4px 12px rgba(5,150,105,.4)" />
      {/* 下段：セーブ＋タイトルへ */}
      <div style={{ gridColumn: "1 / 3", gridRow: "3", display: "flex", gap: 6 }}>
        <button onClick={onSave} style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", fontSize: 11, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, WebkitTapHighlightColor: "transparent" }}>
          <span>💾</span><span>セーブ</span>
        </button>
        <button onClick={onTitle} style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", fontSize: 11, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, WebkitTapHighlightColor: "transparent" }}>
          <span>🏠</span><span>タイトルへ</span>
        </button>
      </div>
    </div>
  );
};

// ─── SkillMenu ────────────────────────────────────────────────
const SkillMenu = ({ skills, player, onSelect, onBack }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "6px 10px 8px", background: "#0c0c1a", overflow: "hidden" }}>
    <div style={{ color: "#c084fc", fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>─ スキル ─</div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, overflowY: "auto" }}>
      {skills.map(sk => {
        const ok = player.mp >= sk.mpCost;
        return (
          <button key={sk.id} onClick={() => ok && onSelect(sk)} style={{
            padding: "7px 10px",
            background: ok ? "linear-gradient(135deg,#1e1b4b,#2d1b69)" : "#12121e",
            border: `1px solid ${ok ? "#7c3aed" : "#2d2d40"}`,
            borderRadius: 9, color: ok ? "#e2e8f0" : "#475569",
            cursor: ok ? "pointer" : "not-allowed",
            display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, flexShrink: 0,
          }}>
            <span style={{ fontWeight: "bold" }}>{sk.emoji} {sk.name}</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#60a5fa", fontSize: 10 }}>MP {sk.mpCost}</div>
              <div style={{ color: "#94a3b8", fontSize: 10 }}>{sk.description}</div>
            </div>
          </button>
        );
      })}
    </div>
    <button onClick={onBack} style={{ marginTop: 6, padding: "7px", background: "#1e293b", border: "1px solid #334155", borderRadius: 9, color: "#64748b", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>← もどる</button>
  </div>
);

// ─── ItemMenu ─────────────────────────────────────────────────
const ItemMenu = ({ items, onSelect, onBack }) => {
  const available = items.filter(i => i.count > 0);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "6px 10px 8px", background: "#0c0c1a", overflow: "hidden" }}>
      <div style={{ color: "#4ade80", fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>─ アイテム ─</div>
      {available.length === 0
        ? <div style={{ flex: 1, color: "#475569", textAlign: "center", paddingTop: 20, fontSize: 12 }}>アイテムがない</div>
        : <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, overflowY: "auto" }}>
            {available.map(it => (
              <button key={it.id} onClick={() => onSelect(it)} style={{
                padding: "7px 10px",
                background: "linear-gradient(135deg,#052e16,#065f46)",
                border: "1px solid #059669", borderRadius: 9,
                color: "#e2e8f0", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, flexShrink: 0,
              }}>
                <span style={{ fontWeight: "bold" }}>{it.emoji} {it.name}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#4ade80", fontSize: 10 }}>{it.description}</div>
                  <div style={{ color: "#94a3b8", fontSize: 10 }}>残り{it.count}個</div>
                </div>
              </button>
            ))}
          </div>
      }
      <button onClick={onBack} style={{ marginTop: 6, padding: "7px", background: "#1e293b", border: "1px solid #334155", borderRadius: 9, color: "#64748b", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>← もどる</button>
    </div>
  );
};

// ─── VictoryScreen ────────────────────────────────────────────
const VictoryScreen = ({ enemy, expGained, levelUpMsg, onNext }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(135deg,#0a0a1a,#0f0f24)" }}>
    <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
    <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: "bold", marginBottom: 5 }}>勝利！</div>
    <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{enemy.name}を倒した！</div>
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "12px 24px", marginBottom: levelUpMsg ? 10 : 24, textAlign: "center" }}>
      <div style={{ color: "#fbbf24", fontSize: 18, fontWeight: "bold" }}>＋{expGained} EXP</div>
      {enemy.bonus && <div style={{ color: "#fb923c", fontSize: 11, marginTop: 3 }}>★ ボーナスバトルクリア！</div>}
    </div>
    {levelUpMsg && (
      <div style={{ background: "linear-gradient(135deg,#1c1200,#2d1e00)", border: "2px solid #fbbf24", borderRadius: 12, padding: "10px 24px", marginBottom: 24, textAlign: "center", animation: "glow 1.5s ease-in-out infinite" }}>
        <div style={{ color: "#fbbf24", fontSize: 15, fontWeight: "bold" }}>✨ {levelUpMsg} ✨</div>
      </div>
    )}
    <button onClick={onNext} style={{ padding: "13px 32px", background: "linear-gradient(135deg,#fbbf24,#d97706)", border: "none", borderRadius: 12, color: "#1a1a00", fontSize: 16, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 14px rgba(251,191,36,.45)" }}>
      つぎへ →
    </button>
  </div>
);

// ─── GameOverScreen ───────────────────────────────────────────
const GameOverScreen = ({ onRetry, onTitle }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: "linear-gradient(135deg,#1a0505,#0a0505)" }}>
    <div style={{ fontSize: 48, marginBottom: 8 }}>💔</div>
    <div style={{ color: "#ef4444", fontSize: 22, fontWeight: "bold", marginBottom: 6 }}>やられた…</div>
    <div style={{ color: "#64748b", fontSize: 13, marginBottom: 28, textAlign: "center" }}>Natsumiは倒れてしまった</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 200 }}>
      <button onClick={onRetry} style={{ padding: "13px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>もう一度</button>
      <button onClick={onTitle} style={{ padding: "10px", background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>タイトルへ</button>
    </div>
  </div>
);

// ─── SaveToast ────────────────────────────────────────────────
const SaveToast = ({ show }) => (
  <div style={{ position: "absolute", top: 50, left: "50%", transform: "translateX(-50%)", background: "#1e293b", border: "1px solid #059669", borderRadius: 8, padding: "6px 16px", color: "#4ade80", fontSize: 12, fontWeight: "bold", opacity: show ? 1 : 0, transition: "opacity .4s", pointerEvents: "none", zIndex: 100, whiteSpace: "nowrap" }}>
    💾 セーブしました
  </div>
);

// ─── TitleScreen ──────────────────────────────────────────────
const TitleScreen = ({ onNewGame, onContinue, saveInfo }) => {
  const [stars] = React.useState(() =>
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      dur: Math.random() * 2 + 2,
    }))
  );
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#05050f,#0a0520,#05050f)", position: "relative", overflow: "hidden" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: "50%", background: "#fff", animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
      <div style={{ textAlign: "center", marginBottom: 40, zIndex: 1 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💑</div>
        <div className="title-glow" style={{ color: "#fbbf24", fontSize: 26, fontWeight: "bold", letterSpacing: "0.08em", marginBottom: 6 }}>Natsumi RPG</div>
        <div style={{ color: "#64748b", fontSize: 12, letterSpacing: "0.1em" }}>〜 21歳の誕生日まで 〜</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "70%", zIndex: 1 }}>
        <button onClick={onNewGame} style={{ padding: "15px", background: "linear-gradient(135deg,#dc2626,#b91c1c)", border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 16px rgba(220,38,38,.4)", letterSpacing: "0.05em" }}>⚔️ はじめから</button>
        <button onClick={onContinue} disabled={!saveInfo} style={{ padding: "15px", background: saveInfo ? "linear-gradient(135deg,#1e40af,#1d4ed8)" : "#1e293b", border: `1px solid ${saveInfo ? "#3b82f6" : "#334155"}`, borderRadius: 14, color: saveInfo ? "#fff" : "#475569", fontSize: 16, fontWeight: "bold", cursor: saveInfo ? "pointer" : "not-allowed", boxShadow: saveInfo ? "0 4px 16px rgba(59,130,246,.4)" : "none", letterSpacing: "0.05em" }}>📖 続きから</button>
      </div>
      {saveInfo && (
        <div style={{ marginTop: 16, color: "#475569", fontSize: 11, zIndex: 1, textAlign: "center" }}>
          <div>{saveInfo.name} Lv.{saveInfo.level}</div>
          <div>{saveInfo.chapter} ・ {saveInfo.date}</div>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 12, color: "#1e293b", fontSize: 10 }}>❤️ Happy 21st Birthday</div>
    </div>
  );
};
