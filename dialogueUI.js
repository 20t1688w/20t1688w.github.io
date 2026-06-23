// ============================================================
// dialogueUI.js  ─  会話パート（チャット積み上げ式）
// ============================================================

// ── 1つのメッセージバブル ───────────────────────────────────
function MsgBubble({ speaker, emoji, text, choiceLabel, isPast }) {
  const isNarr    = speaker === "ナレーション";
  const isMasaya  = speaker === "Masaya";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:3, opacity: isPast ? 0.5 : 1, transition:"opacity .25s" }}>
      {!isNarr && (
        <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent: isMasaya ? "flex-start" : "flex-end" }}>
          {isMasaya  && <span style={{ fontSize:12 }}>{emoji}</span>}
          <span style={{ color: isMasaya ? "#93c5fd" : "#fda4af", fontSize:10, fontWeight:"bold" }}>{speaker}</span>
          {!isMasaya && <span style={{ fontSize:12 }}>{emoji}</span>}
        </div>
      )}
      {choiceLabel ? (
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          <div style={{ background:"linear-gradient(135deg,#4a1942,#7c3aed)", border:"1px solid #a855f7", borderRadius:8, padding:"5px 10px", fontSize:11, color:"#e2e8f0", fontWeight:"bold", maxWidth:"78%" }}>
            👉 {choiceLabel}
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", justifyContent: isNarr ? "center" : isMasaya ? "flex-start" : "flex-end" }}>
          <div style={{
            background: isNarr ? "transparent" : isMasaya ? "linear-gradient(135deg,#0f2040,#1e3a5f)" : "linear-gradient(135deg,#280f28,#3d1a1a)",
            border: isNarr ? "none" : `1px solid ${isMasaya ? "#1e40af55" : "#991b1b55"}`,
            borderRadius: isNarr ? 0 : 10,
            padding: isNarr ? "3px 4px" : "7px 11px",
            maxWidth: isNarr ? "100%" : "80%",
          }}>
            <p style={{
              color: isNarr ? "#64748b" : "#e2e8f0",
              fontSize: isNarr ? 11 : 13,
              lineHeight:1.65, fontStyle: isNarr ? "italic" : "normal",
              whiteSpace:"pre-line", margin:0, textAlign: isNarr ? "center" : "left",
            }}>{text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 会話パート本体 ──────────────────────────────────────────
function DialogueScreen({ event, player, partner, onDone, onGameOver, onRetryBoss, applyBondDelta, applyStatDelta, applyPartnerHpRestore, initialPageIdx, initialBranchId, onStateChange }) {
  const [pageIdx,  setPageIdx]  = useState(initialPageIdx  ?? 0);
  const [branchId, setBranchId] = useState(initialBranchId ?? null);
  const scrollRef = useRef(null);

  // ロード時: セーブ時点より前のメッセージを復元
  const buildInitHistory = () => {
    const result = [];
    const ip = initialPageIdx ?? 0;
    const ib = initialBranchId ?? null;
    if (ib) {
      for (const p of event.pages) result.push({ speaker:p.speaker, emoji:p.emoji, text:p.text });
      const bp = event.branches?.[ib] || [];
      for (let i = 0; i < ip; i++) { if (bp[i]) result.push({ speaker:bp[i].speaker, emoji:bp[i].emoji, text:bp[i].text }); }
    } else {
      for (let i = 0; i < ip; i++) { const p = event.pages[i]; if (p) result.push({ speaker:p.speaker, emoji:p.emoji, text:p.text }); }
    }
    return result;
  };
  const [history, setHistory] = useState(buildInitHistory);

  const pages = branchId ? (event.branches?.[branchId] || []) : event.pages;
  const page  = pages[pageIdx];

  // 新メッセージ時に最下部へスクロール
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history.length, pageIdx, branchId]);

  // ページ変化時エフェクト
  useEffect(() => {
    if (!page) return;
    if (page.bondDelta)        applyBondDelta(page.bondDelta);
    if (page.partnerHpRestore) applyPartnerHpRestore(page.partnerHpRestore);
  }, [pageIdx, branchId]);

  // 親に現在状態を通知（セーブ用）
  useEffect(() => { onStateChange?.(pageIdx, branchId); }, [pageIdx, branchId]);

  if (!page) { onDone(); return null; }

  const pushHistory = (p, choiceLabel) =>
    setHistory(prev => [...prev, { speaker:p.speaker, emoji:p.emoji, text:p.text, choiceLabel }]);

  const advance = () => {
    if (page.gameOver)  { onGameOver();  return; }
    if (page.retryBoss) { onRetryBoss(); return; }
    pushHistory(page);
    const next = pageIdx + 1;
    if (next >= pages.length) { onDone(); return; }
    setPageIdx(next);
  };

  const handleChoice = (choice) => {
    pushHistory(page, choice.label);
    if (choice.bondDelta) applyBondDelta(choice.bondDelta);
    if (choice.statDelta) applyStatDelta(choice.statDelta);
    setBranchId(choice.branchId);
    setPageIdx(0);
  };

  const bgColor = event.bgColor || "#050a14";

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:`linear-gradient(180deg,${bgColor},#05050f)`, overflow:"hidden" }}>
      {/* ヘッダー */}
      <div style={{ padding:"5px 12px", borderBottom:"1px solid #1e293b", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <span style={{ color:"#94a3b8", fontSize:11 }}>💬 会話パート</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ color:"#ec4899", fontSize:10 }}>絆</span>
          <div style={{ width:60, height:6, background:"#1e293b", borderRadius:3, overflow:"hidden", border:"1px solid #334155" }}>
            <div style={{ width:`${Math.min(100, player.bond)}%`, height:"100%", background:"linear-gradient(90deg,#ec4899,#f43f5e)", borderRadius:3, transition:"width .5s ease" }} />
          </div>
          <span style={{ color:"#f43f5e", fontSize:10, fontWeight:"bold" }}>{player.bond}</span>
        </div>
      </div>

      {/* スクロールメッセージエリア */}
      <div ref={scrollRef} style={{ flex:1, overflowY:"auto", padding:"10px 14px 6px", display:"flex", flexDirection:"column", gap:10 }}>
        {history.map((h, i) => (
          <MsgBubble key={i} speaker={h.speaker} emoji={h.emoji} text={h.text} choiceLabel={h.choiceLabel} isPast />
        ))}
        <MsgBubble speaker={page.speaker} emoji={page.emoji} text={page.text} isPast={false} />
      </div>

      {/* 選択肢 or 次へボタン */}
      <div style={{ padding:"6px 12px 10px", background:"#0c0c1a", borderTop:"1px solid #1e293b", flexShrink:0 }}>
        {page.choices ? (
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {page.choices.map((c, i) => (
              <button key={i} onClick={() => handleChoice(c)} style={{
                padding:"11px 14px",
                background: i===0 ? "linear-gradient(135deg,#7f1d1d,#dc2626)" : "linear-gradient(135deg,#1e293b,#334155)",
                border:`1px solid ${i===0 ? "#f87171" : "#475569"}`,
                borderRadius:10, color:"#f1f5f9", fontSize:13, fontWeight:"bold", cursor:"pointer",
                display:"flex", justifyContent:"space-between", alignItems:"center",
              }}>
                <span>{c.label}</span>
                {c.effectLabel && <span style={{ color:"#fbbf24", fontSize:9 }}>{c.effectLabel}</span>}
              </button>
            ))}
          </div>
        ) : (
          <button onClick={advance} style={{
            width:"100%", padding:"10px", background:"transparent",
            border:"1px solid #334155", borderRadius:10,
            color:"#64748b", fontSize:12, cursor:"pointer",
          }}>
            {page.gameOver || page.retryBoss ? "……" : "タップして続ける ▶"}
          </button>
        )}
      </div>
    </div>
  );
}
