// ============================================================
// uiComponents.js  ─  汎用UIパーツ
// ============================================================

// ── HPバー・MPバー ──────────────────────────────────────────
function StatusBar({ current, max, type="hp", label }) {
  const pct  = Math.max(0, Math.min(100, current / max * 100));
  const grad = type === "mp"
    ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
    : pct > 50 ? "linear-gradient(90deg,#22c55e,#4ade80)"
    : pct > 25 ? "linear-gradient(90deg,#eab308,#facc15)"
    :             "linear-gradient(90deg,#ef4444,#f87171)";
  return (
    <div style={{ marginBottom:4 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#94a3b8", marginBottom:2 }}>
        <span style={{ color: type==="mp" ? "#60a5fa" : "#94a3b8" }}>{label || (type==="hp" ? "HP" : "MP")}</span>
        <span style={{ fontWeight:"bold", color: type==="hp" && pct<25 ? "#f87171" : "#e2e8f0" }}>{current} / {max}</span>
      </div>
      <div style={{ height:7, background:"#1e293b", borderRadius:4, overflow:"hidden", border:"1px solid #334155" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:grad, borderRadius:4, transition:"width .35s ease" }} />
      </div>
    </div>
  );
}

// ── 敵ステータスバー ────────────────────────────────────────
function EnemyArea({ enemy }) {
  return (
    <div style={{ padding:"6px 12px 4px", flexShrink:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ color:"#f1f5f9", fontSize:14, fontWeight:"bold" }}>{enemy.name}</span>
          {enemy.boss  && <span style={{ background:"#dc2626", color:"#fff", fontSize:9, padding:"1px 4px", borderRadius:3, fontWeight:"bold" }}>BOSS</span>}
          {enemy.bonus && <span style={{ background:"#d97706", color:"#fff", fontSize:9, padding:"1px 4px", borderRadius:3, fontWeight:"bold" }}>BONUS</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ color:"#fbbf24", fontSize:9 }}>SPD {enemy.speed}</span>
          <span style={{ color:"#475569", fontSize:10 }}>第{enemy.chapter}章</span>
        </div>
      </div>
      <StatusBar current={enemy.hp} max={enemy.maxHp} label="敵HP" />
    </div>
  );
}

// ── 敵グラフィック ──────────────────────────────────────────
function EnemyGraphic({ enemy, shaking, flashing }) {
  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", minHeight:0 }}>
      <div
        className={`${enemy.boss ? "boss-glow " : ""}${!shaking ? "enemy-float" : ""}`}
        style={{
          width:108, height:108,
          background:`linear-gradient(135deg,${enemy.bgColor},#05050f)`,
          border:`2px solid ${enemy.borderColor}`,
          borderRadius:18,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4,
          animation: shaking ? "shake .35s ease" : undefined,
          opacity: flashing ? .25 : 1, transition:"opacity .06s",
          boxShadow:`0 4px 16px ${enemy.borderColor}44`,
          position:"relative", overflow:"hidden",
        }}
      >
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 40%,${enemy.borderColor}22,transparent 70%)`, pointerEvents:"none" }} />
        <span style={{ fontSize:44, lineHeight:1, filter:flashing ? "brightness(3)" : "none" }}>{enemy.emoji}</span>
        <span style={{ fontSize:9, color:"#64748b", textAlign:"center", padding:"0 6px", lineHeight:1.3 }}>{enemy.description}</span>
      </div>
    </div>
  );
}

// ── プレイヤーステータス（素早さ表示付き） ──────────────────
function PlayerStatus({ player, partner }) {
  return (
    <div style={{
      padding:"4px 10px 6px",
      background:"linear-gradient(to top,#05050f 60%,transparent)",
      borderTop:"1px solid #1e293b", flexShrink:0,
      display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 8px",
    }}>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:3 }}>
          <span style={{ fontSize:15 }}>👩</span>
          <span style={{ color:"#f1f5f9", fontSize:12, fontWeight:"bold" }}>{player.name}</span>
          <span style={{ color:"#475569", fontSize:9 }}>Lv.{player.level}</span>
          <span style={{ color:"#fbbf24", fontSize:9, marginLeft:"auto" }}>SPD {player.speed}</span>
        </div>
        <StatusBar current={player.hp} max={player.maxHp} type="hp" />
        <StatusBar current={player.mp} max={player.maxMp} type="mp" />
      </div>
      <div style={{ opacity:partner.ko ? .45 : 1, transition:"opacity .3s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:3 }}>
          <span style={{ fontSize:15 }}>👨</span>
          <span style={{ color:"#93c5fd", fontSize:12, fontWeight:"bold" }}>{partner.name}</span>
          <span style={{ color:"#475569", fontSize:9 }}>Lv.{partner.level}</span>
          {partner.ko
            ? <span style={{ background:"#7f1d1d", color:"#fca5a5", fontSize:9, padding:"1px 3px", borderRadius:3, fontWeight:"bold", marginLeft:"auto" }}>KO</span>
            : <span style={{ color:"#fbbf24", fontSize:9, marginLeft:"auto" }}>SPD {partner.speed}</span>
          }
        </div>
        <StatusBar current={partner.hp} max={partner.maxHp} type="hp" />
        <StatusBar current={partner.mp} max={partner.maxMp} type="mp" />
      </div>
    </div>
  );
}

// ── バトルログ ──────────────────────────────────────────────
function BattleLog({ logs, logRef }) {
  const S = { damage:{color:"#f87171",icon:"⚔️"}, heal:{color:"#4ade80",icon:"💚"}, skill:{color:"#c084fc",icon:"✨"}, system:{color:"#fbbf24",icon:"📢"}, normal:{color:"#e2e8f0",icon:"▶"} };
  return (
    <div ref={logRef} style={{ flex:"0 0 72px", overflowY:"auto", padding:"5px 10px", background:"#080810", borderTop:"1px solid #1e293b", borderBottom:"1px solid #1e293b" }}>
      {logs.map((log, i) => { const s = S[log.type] || S.normal; return (
        <div key={i} className="log-entry" style={{ padding:"2px 0", color:s.color, fontSize:11, lineHeight:1.5, display:"flex", gap:4 }}>
          <span style={{ flexShrink:0, fontSize:9 }}>{s.icon}</span><span>{log.text}</span>
        </div>
      );})}
    </div>
  );
}

// ── セーブトースト ──────────────────────────────────────────
function SaveToast({ show }) {
  return (
    <div style={{ position:"absolute", top:50, left:"50%", transform:"translateX(-50%)", background:"#1e293b", border:"1px solid #059669", borderRadius:8, padding:"6px 16px", color:"#4ade80", fontSize:12, fontWeight:"bold", opacity:show ? 1 : 0, transition:"opacity .4s", pointerEvents:"none", zIndex:100, whiteSpace:"nowrap" }}>
      💾 セーブしました
    </div>
  );
}

// ── 素早さ順インジケーター ──────────────────────────────────
function TurnOrderBadge({ player, partner, enemy }) {
  if (!enemy) return null;
  const actors = [
    { label:"👩", spd:player.speed, color:"#fda4af" },
    ...(!partner.ko ? [{ label:"👨", spd:partner.speed, color:"#93c5fd" }] : []),
    { label:enemy.emoji, spd:enemy.speed, color:"#94a3b8" },
  ].sort((a, b) => b.spd - a.spd);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
      <span style={{ color:"#fbbf24", fontSize:9 }}>⚡</span>
      {actors.map((a, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color:"#334155", fontSize:9 }}>›</span>}
          <span style={{ fontSize:12 }}>{a.label}</span>
          <span style={{ color:a.color, fontSize:8 }}>{a.spd}</span>
        </React.Fragment>
      ))}
    </div>
  );
}
