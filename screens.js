// ============================================================
// screens.js  ─  タイトル・エンディング・アイテムイベント
// ============================================================

// ── タイトル画面 ────────────────────────────────────────────
function TitleScreen({ onNewGame, onContinue, onContinueFile }) {
  const save    = loadGame();
  const fileRef = useRef(null);
  const [stars] = useState(() => Array.from({ length:30 }, () => ({ x:Math.random()*100, y:Math.random()*100, size:Math.random()*2+1, delay:Math.random()*3, dur:Math.random()*2+2 })));

  const handleFileChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { onContinueFile(await loadGameFromFile(file)); } catch {}
    e.target.value = "";
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#05050f,#0a0520,#05050f)", position:"relative", overflow:"hidden" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:"50%", background:"#fff", animation:`star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
      <div style={{ textAlign:"center", marginBottom:40, zIndex:1 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>💑</div>
        <div className="title-glow" style={{ color:"#fbbf24", fontSize:26, fontWeight:"bold", letterSpacing:"0.08em", marginBottom:6 }}>Natsumi RPG</div>
        <div style={{ color:"#64748b", fontSize:12, letterSpacing:"0.1em" }}>〜 21歳の誕生日まで 〜</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"70%", zIndex:1 }}>
        <button onClick={onNewGame} style={{ padding:"15px", background:"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:"bold", cursor:"pointer", boxShadow:"0 4px 16px rgba(220,38,38,.4)", letterSpacing:"0.05em" }}>⚔️ はじめから</button>
        <button onClick={onContinue} disabled={!save} style={{ padding:"15px", background: save ? "linear-gradient(135deg,#1e40af,#1d4ed8)" : "#1e293b", border:`1px solid ${save ? "#3b82f6" : "#334155"}`, borderRadius:14, color: save ? "#fff" : "#475569", fontSize:16, fontWeight:"bold", cursor: save ? "pointer" : "not-allowed", boxShadow: save ? "0 4px 16px rgba(59,130,246,.4)" : "none", letterSpacing:"0.05em" }}>📖 続きから（前回）</button>
        <button onClick={() => fileRef.current?.click()} style={{ padding:"12px", background:"linear-gradient(135deg,#0f3a2a,#065f46)", border:"1px solid #059669", borderRadius:14, color:"#4ade80", fontSize:14, fontWeight:"bold", cursor:"pointer", letterSpacing:"0.05em" }}>📂 ファイルから読み込む</button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleFileChange} style={{ display:"none" }} />
      </div>
      {save && (
        <div style={{ marginTop:16, color:"#475569", fontSize:11, zIndex:1, textAlign:"center" }}>
          <div>{save.player?.name} Lv.{save.player?.level}</div>
          <div>シナリオ {save.scenarioIdx ?? 0} ・ {fmtDate(save.savedAt)}</div>
        </div>
      )}
      <div style={{ position:"absolute", bottom:12, color:"#1e293b", fontSize:10 }}>❤️ Happy 21st Birthday</div>
    </div>
  );
}

// ── エンディング画面 ────────────────────────────────────────
function EndingScreen({ player, partner, onTitle }) {
  const [stars] = useState(() => Array.from({ length:40 }, () => ({ x:Math.random()*100, y:Math.random()*100, size:Math.random()*3+1, delay:Math.random()*3, dur:Math.random()*2+1.5 })));
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#05050f,#0a051a,#05050f)", position:"relative", overflow:"hidden" }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:"50%", background:i%3===0?"#fbbf24":i%3===1?"#f43f5e":"#fff", opacity:.8, animation:`star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
      ))}
      <div style={{ zIndex:1, textAlign:"center", padding:"0 24px" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🎂</div>
        <div className="title-glow" style={{ color:"#fbbf24", fontSize:24, fontWeight:"bold", marginBottom:8, letterSpacing:"0.06em" }}>Happy 21st Birthday!</div>
        <div style={{ color:"#ec4899", fontSize:16, fontWeight:"bold", marginBottom:16 }}>Natsumi、誕生日おめでとう！</div>
        <div style={{ background:"linear-gradient(135deg,#1a0a1a88,#0a1a1a88)", border:"1px solid #7c3aed", borderRadius:14, padding:"16px 20px", marginBottom:16, backdropFilter:"blur(8px)" }}>
          <div style={{ color:"#e2e8f0", fontSize:13, lineHeight:1.8, whiteSpace:"pre-line" }}>{
`出会いからここまで
たくさんの冒険をありがとう。

喧嘩もしたけど、笑い合った日々も
全部が大切な思い出だよ。

これからもずっと、二人で進んでいこう。

これからもよろしくね。 ❤️`
          }</div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:14 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:20 }}>👩</div>
            <div style={{ color:"#fbbf24", fontSize:11, fontWeight:"bold" }}>{player.name}</div>
            <div style={{ color:"#64748b", fontSize:10 }}>Lv.{player.level}</div>
          </div>
          <div style={{ color:"#ec4899", fontSize:20, display:"flex", alignItems:"center" }}>💑</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:20 }}>👨</div>
            <div style={{ color:"#93c5fd", fontSize:11, fontWeight:"bold" }}>{partner.name}</div>
            <div style={{ color:"#64748b", fontSize:10 }}>Lv.{partner.level}</div>
          </div>
        </div>
        <div style={{ color:"#475569", fontSize:10, marginBottom:16 }}>THE END ✨</div>
        <button onClick={onTitle} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#1e293b,#334155)", border:"1px solid #475569", borderRadius:12, color:"#94a3b8", fontSize:14, fontWeight:"bold", cursor:"pointer" }}>
          🏠 タイトルへ
        </button>
      </div>
    </div>
  );
}

// ── アイテムイベント画面 ────────────────────────────────────
function ItemEventScreen({ event, onDone }) {
  return (
    <div className="pop-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, background:"linear-gradient(135deg,#0a0a14,#14080a)" }}>
      <div style={{ fontSize:36, marginBottom:8 }}>🎁</div>
      <div style={{ color:"#fbbf24", fontSize:18, fontWeight:"bold", marginBottom:20 }}>アイテム入手！</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:280, marginBottom:28 }}>
        {event.gifts.map((g, i) => (
          <div key={i} className="slide-up" style={{ background:"linear-gradient(135deg,#1a0a1a,#2d0f2d)", border:"1px solid #7c3aed", borderRadius:12, padding:"12px 14px", animationDelay:`${i * 0.12}s` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:28 }}>{g.emoji}</span>
              <div>
                <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:"bold" }}>{g.name}</div>
                <div style={{ color:"#ec4899", fontSize:10 }}>{g.who} が入手！</div>
              </div>
            </div>
            <div style={{ color:"#94a3b8", fontSize:11, lineHeight:1.5 }}>{g.description}</div>
          </div>
        ))}
      </div>
      <button onClick={onDone} style={{ padding:"13px 32px", background:"linear-gradient(135deg,#7c3aed,#6d28d9)", border:"none", borderRadius:12, color:"#fff", fontSize:16, fontWeight:"bold", cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,.4)" }}>
        つぎへ →
      </button>
    </div>
  );
}
