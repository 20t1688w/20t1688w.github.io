// ============================================================
// battleUI.js  ─  バトル画面UIコンポーネント
// ============================================================

// ── 共通ボタン ──────────────────────────────────────────────
function ActionBtn({ label, emoji, onClick, grad, shadow, disabled, col, row, tall }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      gridColumn:col, gridRow:row,
      background: disabled ? "#1e293b" : grad,
      border:"none", borderRadius:12,
      color: disabled ? "#475569" : "#fff",
      fontWeight:"bold", cursor: disabled ? "not-allowed" : "pointer",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
      boxShadow: disabled ? "none" : shadow, fontSize:13,
      WebkitTapHighlightColor:"transparent",
    }}>
      <span style={{ fontSize: tall ? 22 : 20 }}>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

// ── Natsumi コマンドボタン ──────────────────────────────────
function NatsumiCommandButtons({ onFight, onSkill, onItem, onSave, onTitle, disabled }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#0c0c1a", overflow:"hidden" }}>
      <div style={{ padding:"3px 10px 2px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:13 }}>👩</span>
        <span style={{ color:"#fda4af", fontSize:11, fontWeight:"bold" }}>Natsumiのコマンド</span>
      </div>
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"1fr 1fr 32px", gap:5, padding:"5px 10px 7px" }}>
        <ActionBtn label="たたかう" emoji="⚔️" onClick={onFight} col="1" row="1 / 3" tall
          grad="linear-gradient(135deg,#dc2626,#b91c1c)" shadow="0 4px 12px rgba(220,38,38,.45)" disabled={disabled} />
        <ActionBtn label="スキル"   emoji="✨" onClick={onSkill} col="2" row="1"
          grad="linear-gradient(135deg,#7c3aed,#6d28d9)" shadow="0 4px 12px rgba(124,58,237,.4)" disabled={disabled} />
        <ActionBtn label="アイテム" emoji="🎒" onClick={onItem}  col="2" row="2"
          grad="linear-gradient(135deg,#059669,#047857)" shadow="0 4px 12px rgba(5,150,105,.4)" disabled={disabled} />
        <div style={{ gridColumn:"1 / 3", gridRow:"3", display:"flex", gap:5 }}>
          <button onClick={onSave} style={{ flex:1, background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#94a3b8", fontSize:10, fontWeight:"bold", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>
            <span>💾</span><span>セーブ</span>
          </button>
          <button onClick={onTitle} style={{ flex:1, background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#94a3b8", fontSize:10, fontWeight:"bold", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>
            <span>🏠</span><span>タイトル</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Masaya コマンドボタン ───────────────────────────────────
function MasayaCommandButtons({ onFight, onSkill, partner, disabled }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#0a0c18", overflow:"hidden" }}>
      <div style={{ padding:"3px 10px 2px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:5 }}>
        <span style={{ fontSize:13 }}>👨</span>
        <span style={{ color:"#93c5fd", fontSize:11, fontWeight:"bold" }}>Masayaのコマンド</span>
        <span style={{ color:"#475569", fontSize:9, marginLeft:"auto" }}>MP {partner.mp}/{partner.maxMp}</span>
      </div>
      <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, padding:"5px 10px 7px" }}>
        <ActionBtn label="たたかう" emoji="⚔️" onClick={onFight}
          grad="linear-gradient(135deg,#1e40af,#1d4ed8)" shadow="0 4px 12px rgba(30,64,175,.45)" disabled={disabled} />
        <ActionBtn label="スキル" emoji="⭐" onClick={onSkill}
          grad="linear-gradient(135deg,#0e7490,#0891b2)" shadow="0 4px 12px rgba(14,116,144,.4)" disabled={disabled} />
      </div>
    </div>
  );
}

// ── Natsumi スキルメニュー ──────────────────────────────────
function NatsumiSkillMenu({ player, partner, onSelect, onBack }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"5px 10px 7px", background:"#0c0c1a", overflow:"hidden" }}>
      <div style={{ color:"#c084fc", fontSize:11, fontWeight:"bold", marginBottom:4 }}>─ Natsumiのスキル ─</div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5, overflowY:"auto" }}>
        {SKILLS_DATA.map(sk => { const ok = player.mp >= sk.mpCost; return (
          <button key={sk.id} onClick={() => ok && onSelect(sk)} style={{ padding:"6px 10px", background: ok ? "linear-gradient(135deg,#1e1b4b,#2d1b69)" : "#12121e", border:`1px solid ${ok ? "#7c3aed" : "#2d2d40"}`, borderRadius:9, color: ok ? "#e2e8f0" : "#475569", cursor: ok ? "pointer" : "not-allowed", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, flexShrink:0 }}>
            <span style={{ fontWeight:"bold" }}>{sk.emoji} {sk.name}</span>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:"#60a5fa", fontSize:9 }}>MP {sk.mpCost}</div>
              <div style={{ color:"#94a3b8", fontSize:9 }}>{sk.description}</div>
            </div>
          </button>
        );})}
      </div>
      <button onClick={onBack} style={{ marginTop:5, padding:"6px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#64748b", fontSize:11, cursor:"pointer", flexShrink:0 }}>← もどる</button>
    </div>
  );
}

// ── Masaya スキルメニュー ───────────────────────────────────
function MasayaSkillMenu({ partner, onSelect, onBack }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"5px 10px 7px", background:"#0a0c18", overflow:"hidden" }}>
      <div style={{ color:"#38bdf8", fontSize:11, fontWeight:"bold", marginBottom:4 }}>─ Masayaのスキル ─</div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5, overflowY:"auto" }}>
        {MASAYA_SKILLS_DATA.map(sk => { const ok = partner.mp >= sk.mpCost; return (
          <button key={sk.id} onClick={() => ok && onSelect(sk)} style={{ padding:"6px 10px", background: ok ? "linear-gradient(135deg,#0c1e3a,#0e3a5f)" : "#12121e", border:`1px solid ${ok ? "#0ea5e9" : "#2d2d40"}`, borderRadius:9, color: ok ? "#e2e8f0" : "#475569", cursor: ok ? "pointer" : "not-allowed", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, flexShrink:0 }}>
            <span style={{ fontWeight:"bold" }}>{sk.emoji} {sk.name}</span>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:"#38bdf8", fontSize:9 }}>MP {sk.mpCost}</div>
              <div style={{ color:"#94a3b8", fontSize:9 }}>{sk.description}</div>
            </div>
          </button>
        );})}
      </div>
      <button onClick={onBack} style={{ marginTop:5, padding:"6px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#64748b", fontSize:11, cursor:"pointer", flexShrink:0 }}>← もどる</button>
    </div>
  );
}

// ── アイテムメニュー ────────────────────────────────────────
function ItemMenu({ items, onSelect, onBack }) {
  const avail = items.filter(i => i.count > 0);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"5px 10px 7px", background:"#0c0c1a", overflow:"hidden" }}>
      <div style={{ color:"#4ade80", fontSize:11, fontWeight:"bold", marginBottom:4 }}>─ アイテム ─</div>
      {avail.length === 0
        ? <div style={{ flex:1, color:"#475569", textAlign:"center", paddingTop:16, fontSize:11 }}>アイテムがない</div>
        : <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5, overflowY:"auto" }}>
            {avail.map(it => (
              <button key={it.id} onClick={() => onSelect(it)} style={{ padding:"6px 10px", background:"linear-gradient(135deg,#052e16,#065f46)", border:"1px solid #059669", borderRadius:9, color:"#e2e8f0", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, flexShrink:0 }}>
                <span style={{ fontWeight:"bold" }}>{it.emoji} {it.name}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:"#4ade80", fontSize:9 }}>{it.description}</div>
                  <div style={{ color:"#94a3b8", fontSize:9 }}>残り{it.count}個</div>
                </div>
              </button>
            ))}
          </div>
      }
      <button onClick={onBack} style={{ marginTop:5, padding:"6px", background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#64748b", fontSize:11, cursor:"pointer", flexShrink:0 }}>← もどる</button>
    </div>
  );
}

// ── 勝利画面 ────────────────────────────────────────────────
function VictoryScreen({ enemy, expGained, levelUpMsg, onNext }) {
  return (
    <div className="pop-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, background:"linear-gradient(135deg,#0a0a1a,#0f0f24)" }}>
      <div style={{ fontSize:46, marginBottom:8 }}>🎉</div>
      <div style={{ color:"#fbbf24", fontSize:22, fontWeight:"bold", marginBottom:5 }}>勝利！</div>
      <div style={{ color:"#94a3b8", fontSize:13, marginBottom:16, textAlign:"center" }}>{enemy.name}を倒した！</div>
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:12, padding:"12px 24px", marginBottom: levelUpMsg ? 10 : 24, textAlign:"center" }}>
        <div style={{ color:"#fbbf24", fontSize:18, fontWeight:"bold" }}>＋{expGained} EXP</div>
        {enemy.bonus && <div style={{ color:"#fb923c", fontSize:11, marginTop:3 }}>★ ボーナスバトルクリア！</div>}
      </div>
      {levelUpMsg && (
        <div style={{ background:"linear-gradient(135deg,#1c1200,#2d1e00)", border:"2px solid #fbbf24", borderRadius:12, padding:"10px 24px", marginBottom:24, textAlign:"center", animation:"glow 1.5s ease-in-out infinite" }}>
          <div style={{ color:"#fbbf24", fontSize:15, fontWeight:"bold" }}>✨ {levelUpMsg} ✨</div>
        </div>
      )}
      <button onClick={onNext} style={{ padding:"13px 32px", background:"linear-gradient(135deg,#fbbf24,#d97706)", border:"none", borderRadius:12, color:"#1a1a00", fontSize:16, fontWeight:"bold", cursor:"pointer", boxShadow:"0 4px 14px rgba(251,191,36,.45)" }}>
        つぎへ →
      </button>
    </div>
  );
}

// ── ゲームオーバー画面 ──────────────────────────────────────
function GameOverScreen({ onRetry, onTitle }) {
  return (
    <div className="pop-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, background:"linear-gradient(135deg,#1a0505,#0a0505)" }}>
      <div style={{ fontSize:46, marginBottom:8 }}>💔</div>
      <div style={{ color:"#ef4444", fontSize:22, fontWeight:"bold", marginBottom:6 }}>やられた…</div>
      <div style={{ color:"#64748b", fontSize:13, marginBottom:28, textAlign:"center" }}>Natsumiは倒れてしまった</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:200 }}>
        <button onClick={onRetry} style={{ padding:"13px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:12, color:"#fff", fontSize:15, fontWeight:"bold", cursor:"pointer" }}>もう一度</button>
        <button onClick={onTitle} style={{ padding:"10px", background:"#1e293b", border:"1px solid #334155", borderRadius:12, color:"#94a3b8", fontSize:13, cursor:"pointer" }}>🏠 タイトルへ</button>
      </div>
    </div>
  );
}
