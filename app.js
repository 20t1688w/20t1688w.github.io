// ============================================================
// app.js  ─  メインApp・シナリオ管理・バトルロジック
//
// フェーズ一覧（バトル中）:
//   "select_natsumi"       … Natsumiのコマンド選択
//   "select_natsumi_skill" … Natsumiのスキル選択
//   "select_natsumi_item"  … Natsumiのアイテム選択
//   "select_masaya"        … Masayaのコマンド選択
//   "select_masaya_skill"  … Masayaのスキル選択
//   "executing"            … 全行動の実行アニメーション中
//   "victory"              … 勝利画面
//   "gameover"             … ゲームオーバー画面
// ============================================================

function App() {
  const [screen,       setScreen]       = useState("title");
  const [player,       setPlayer]       = useState({ ...PLAYER_INITIAL });
  const [partner,      setPartner]      = useState({ ...PARTNER_INITIAL });
  const [items,        setItems]        = useState(ITEMS_DATA.map(i => ({ ...i })));
  const [scenarioIdx,  setScenarioIdx]  = useState(0);
  const [enemy,        setEnemy]        = useState(null);
  const [logs,         setLogs]         = useState([]);
  const [phase,        setPhase]        = useState("select_natsumi");
  const [shaking,      setShaking]      = useState(false);
  const [flashing,     setFlashing]     = useState(false);
  const [showToast,    setShowToast]    = useState(false);
  const [victoryInfo,  setVictoryInfo]  = useState(null);
  const [debugMode,    setDebugMode]    = useState(false);
  const [dialoguePage,   setDialoguePage]   = useState(0);
  const [dialogueBranch, setDialogueBranch] = useState(null);
  const [initDlgPage,    setInitDlgPage]    = useState(0);
  const [initDlgBranch,  setInitDlgBranch]  = useState(null);

  // Natsumiの保留アクション（Masayaコマンド選択中に保持）
  const pendingNatRef = useRef(null);
  // 激励バフフラグ（Masayaの激励スキル使用時）
  const boostFlagRef  = useRef(false);

  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logs]);

  const addLog = useCallback((text, type="normal") => setLogs(prev => [...prev, { text, type }]), []);

  const currentEvent = SCENARIO[scenarioIdx] || null;

  // ─────────────────────────────────────────────────────────
  // セーブ / タイトル
  // ─────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    saveGame({ player, partner, items, scenarioIdx, dialoguePage, dialogueBranch });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  }, [player, partner, items, scenarioIdx, dialoguePage, dialogueBranch]);

  const goTitle = useCallback(() => setScreen("title"), []);

  // ─────────────────────────────────────────────────────────
  // シナリオ起動（セーブ再開 / バトル開始 兼用）
  // ─────────────────────────────────────────────────────────
  const startFromIdx = useCallback((idx) => {
    const ev = SCENARIO[idx];
    if (!ev) return;
    setScenarioIdx(idx);
    setScreen("battle");
    if (ev.type === "battle") {
      const en = { ...ENEMIES_DATA[ev.enemyId], hp: debugMode ? 1 : ENEMIES_DATA[ev.enemyId].maxHp };
      setEnemy(en);
      if (ev.partnerHpPenalty) setPartner(prev => ({ ...prev, hp: Math.max(1, prev.hp - ev.partnerHpPenalty) }));
      setLogs([{ text:"バトル開始！", type:"system" }, { text:`${en.name}が現れた！`, type:"system" }]);
      setPhase("select_natsumi");
    }
  }, [debugMode]);

  const advanceScenario = useCallback((fromIdx) => {
    const nextIdx = fromIdx + 1;
    if (nextIdx >= SCENARIO.length) return;
    const ev = SCENARIO[nextIdx];
    setScenarioIdx(nextIdx);
    if (ev.type === "battle") {
      const en = { ...ENEMIES_DATA[ev.enemyId], hp: debugMode ? 1 : ENEMIES_DATA[ev.enemyId].maxHp };
      if (ev.partnerHpPenalty) setPartner(prev => ({ ...prev, hp: Math.max(1, prev.hp - ev.partnerHpPenalty) }));
      setEnemy(en);
      setLogs([{ text:"バトル開始！", type:"system" }, { text:`${en.name}が現れた！`, type:"system" }]);
      setPhase("select_natsumi");
    }
  }, [debugMode]);

  // ─────────────────────────────────────────────────────────
  // はじめから / 続きから / ファイルから
  // ─────────────────────────────────────────────────────────
  const startNewGame = useCallback(() => {
    setPlayer({ ...PLAYER_INITIAL });
    setPartner({ ...PARTNER_INITIAL });
    setItems(ITEMS_DATA.map(i => ({ ...i })));
    setDialoguePage(0); setInitDlgPage(0);
    setDialogueBranch(null); setInitDlgBranch(null);
    setScenarioIdx(0);
    advanceScenario(-1);
    setScreen("battle");
  }, [advanceScenario]);

  const applyLoad = useCallback((save) => {
    setPlayer(save.player);
    setPartner(save.partner);
    setItems(save.items);
    const pg = save.dialoguePage ?? 0;
    const br = save.dialogueBranch ?? null;
    setDialoguePage(pg); setInitDlgPage(pg);
    setDialogueBranch(br); setInitDlgBranch(br);
    startFromIdx(save.scenarioIdx ?? 0);
  }, [startFromIdx]);

  const startContinue = useCallback(() => {
    const save = loadGame();
    if (save) applyLoad(save);
  }, [applyLoad]);

  const startContinueFile = useCallback((save) => {
    if (!save) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {}
    applyLoad(save);
  }, [applyLoad]);

  // ─────────────────────────────────────────────────────────
  // 会話パートのコールバック
  // ─────────────────────────────────────────────────────────
  const handleDialogueDone = useCallback(() => {
    setDialoguePage(0); setInitDlgPage(0);
    setDialogueBranch(null); setInitDlgBranch(null);
    advanceScenario(scenarioIdx);
  }, [scenarioIdx, advanceScenario]);

  const handleDialogueGameOver = useCallback(() => setPhase("gameover"), []);

  const handleRetryBoss = useCallback(() => {
    for (let i = scenarioIdx; i >= 0; i--) {
      if (SCENARIO[i].type === "battle" && ENEMIES_DATA[SCENARIO[i].enemyId]?.boss) {
        startFromIdx(i); return;
      }
    }
  }, [scenarioIdx, startFromIdx]);

  const applyBondDelta = useCallback((d) =>
    setPlayer(prev => ({ ...prev, bond: Math.min(100, Math.max(0, prev.bond + d)) })), []);
  const applyStatDelta = useCallback((d) =>
    setPlayer(prev => ({ ...prev, stats: { ...prev.stats, ...Object.fromEntries(Object.entries(d).map(([k,v]) => [k, (prev.stats[k]||0)+v])) } })), []);
  const applyPartnerHpRestore = useCallback((amount) =>
    setPartner(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + amount) })), []);

  // ─────────────────────────────────────────────────────────
  // バトルアニメーション
  // ─────────────────────────────────────────────────────────
  const hitAnimation = useCallback(() => new Promise(res => {
    setShaking(true);
    setTimeout(() => { setFlashing(true); setTimeout(() => { setShaking(false); setFlashing(false); res(); }, 110); }, 110);
  }), []);

  // ─────────────────────────────────────────────────────────
  // 勝利処理
  // ─────────────────────────────────────────────────────────
  const handleVictory = useCallback((en) => {
    const ev = SCENARIO[scenarioIdx];
    let levelUpMsg = null;
    if (ev?.levelUp) {
      const { who, newLevel } = ev.levelUp;
      levelUpMsg = `${who}がLv.${newLevel}になった！`;
      if (who === "Natsumi") setPlayer(prev => ({ ...prev, level: newLevel }));
      if (who === "Masaya")  setPartner(prev => ({ ...prev, level: newLevel }));
    }
    if (ev?.isFinal) {
      setPlayer(prev => ({ ...prev, level:21 }));
      levelUpMsg = "NatsumiがLv.21になった！ ─ ゲームクリア！";
    }
    setVictoryInfo({ enemy: en, expGained: en.exp, levelUpMsg });
    setPhase("victory");
  }, [scenarioIdx]);

  // ─────────────────────────────────────────────────────────
  // 全行動実行（素早さ順）
  // ─────────────────────────────────────────────────────────
  const executeAllActions = useCallback(async (natAction, masAction) => {
    setPhase("executing");
    boostFlagRef.current = false;

    // 状態スナップショット（ローカルで管理しながらsetStateでUI更新）
    let pl = { ...player };
    let pt = { ...partner };
    let en = { ...enemy };
    let ended = false;

    // 素早さ順にソート
    const actors = [
      { id:"natsumi", spd: pl.speed ?? 65 },
      ...(!pt.ko ? [{ id:"masaya", spd: pt.speed ?? 80 }] : []),
      { id:"enemy",   spd: en.speed ?? 50 },
    ].sort((a, b) => b.spd - a.spd);

    // Masayaが「庇う」を選択しているか
    const masayCovering = masAction?.type === "skill" && masAction?.skill?.type === "cover";

    for (const actor of actors) {
      if (ended) break;
      if (actor.id === "enemy" && en.hp <= 0) continue;
      await wait(280);

      // ────── Natsumi の行動 ──────
      if (actor.id === "natsumi") {
        const act = natAction;
        // 激励バフが有効なら攻撃力を一時的に1.5倍
        const atkMult = boostFlagRef.current ? 1.5 : 1.0;
        boostFlagRef.current = false;

        if (act.type === "attack") {
          const dmg = Math.round(calcPhys(Math.floor(pl.attack * atkMult), en.defense));
          const msg = atkMult > 1 ? `✨ 激励効果！Natsumiの攻撃！ ${en.name}に${dmg}のダメージ！` : `Natsumiの攻撃！ ${en.name}に${dmg}のダメージ！`;
          addLog(msg, "damage");
          en = { ...en, hp: Math.max(0, en.hp - dmg) };
          setEnemy(prev => ({ ...prev, hp: en.hp }));
          await hitAnimation();
          if (en.hp <= 0) { handleVictory({ ...en }); ended = true; break; }

        } else if (act.type === "skill") {
          const sk = act.skill;
          if (pl.mp < sk.mpCost) {
            addLog("MPが足りない！ 通常攻撃に切り替え！", "system");
            const dmg = Math.round(calcPhys(Math.floor(pl.attack * atkMult), en.defense));
            addLog(`Natsumiの攻撃！ ${en.name}に${dmg}のダメージ！`, "damage");
            en = { ...en, hp: Math.max(0, en.hp - dmg) };
            setEnemy(prev => ({ ...prev, hp: en.hp }));
            await hitAnimation();
            if (en.hp <= 0) { handleVictory({ ...en }); ended = true; break; }
          } else {
            pl = { ...pl, mp: pl.mp - sk.mpCost };
            setPlayer(prev => ({ ...prev, mp: pl.mp }));
            if (sk.type === "attack") {
              let dmg = calcSkill(Math.floor(pl.attack * atkMult), sk.powerMultiplier, en.defense);
              if (sk.partnered && !pt.ko) {
                dmg += Math.floor(pt.attack * 0.8);
                addLog(`NatsumiとMasayaの「${sk.name}」！`, "skill");
                await wait(180);
                addLog(`${en.name}に${dmg}の大ダメージ！！`, "skill");
              } else {
                addLog(`Natsumiは「${sk.name}」！ ${en.name}に${dmg}のダメージ！`, "skill");
              }
              en = { ...en, hp: Math.max(0, en.hp - dmg) };
              setEnemy(prev => ({ ...prev, hp: en.hp }));
              await hitAnimation();
              if (en.hp <= 0) { handleVictory({ ...en }); ended = true; break; }
            } else if (sk.type === "heal") {
              const h = Math.min(pl.maxHp - pl.hp, sk.healAmount);
              pl = { ...pl, hp: pl.hp + h };
              setPlayer(prev => ({ ...prev, hp: pl.hp }));
              addLog(`Natsumiは「${sk.name}」！ HPが${h}回復！`, "heal");
            }
          }

        } else if (act.type === "item") {
          const it = act.item;
          const msgs = [];
          if (it.healAmount > 0) { const h = Math.min(pl.maxHp - pl.hp, it.healAmount); pl = { ...pl, hp: pl.hp + h }; setPlayer(prev => ({ ...prev, hp: pl.hp })); msgs.push(`HPが${h}回復`); }
          if (it.mpRestore  > 0) { const m = Math.min(pl.maxMp - pl.mp, it.mpRestore);  pl = { ...pl, mp: pl.mp + m }; setPlayer(prev => ({ ...prev, mp: pl.mp })); msgs.push(`MPが${m}回復`); }
          addLog(`「${it.name}」を使った！ ${msgs.join("・")}！`, "heal");
          setItems(prev => prev.map(i => i.id === it.id ? { ...i, count: i.count - 1 } : i));
        }
      }

      // ────── Masaya の行動 ──────
      else if (actor.id === "masaya") {
        const act = masAction;
        if (!act) continue;

        if (act.type === "attack") {
          const dmg = calcPhys(pt.attack, en.defense);
          addLog(`Masayaの攻撃！ ${en.name}に${dmg}のダメージ！`, "damage");
          en = { ...en, hp: Math.max(0, en.hp - dmg) };
          setEnemy(prev => ({ ...prev, hp: en.hp }));
          await hitAnimation();
          if (en.hp <= 0) { handleVictory({ ...en }); ended = true; break; }

        } else if (act.type === "skill") {
          const sk = act.skill;
          if (pt.mp < sk.mpCost) {
            addLog("MasayaのMPが足りない！ 通常攻撃に切り替え！", "system");
            const dmg = calcPhys(pt.attack, en.defense);
            addLog(`Masayaの攻撃！ ${en.name}に${dmg}のダメージ！`, "damage");
            en = { ...en, hp: Math.max(0, en.hp - dmg) };
            setEnemy(prev => ({ ...prev, hp: en.hp }));
            await hitAnimation();
            if (en.hp <= 0) { handleVictory({ ...en }); ended = true; break; }
          } else {
            pt = { ...pt, mp: pt.mp - sk.mpCost };
            setPartner(prev => ({ ...prev, mp: pt.mp }));
            if (sk.type === "cover") {
              addLog(`Masayaは「${sk.name}」！ Natsumiを守る構えを取った！`, "skill");
            } else if (sk.type === "attack") {
              const dmg = calcSkill(pt.attack, sk.powerMultiplier, en.defense);
              addLog(`Masayaは「${sk.name}」！ ${en.name}に${dmg}のダメージ！`, "skill");
              en = { ...en, hp: Math.max(0, en.hp - dmg) };
              setEnemy(prev => ({ ...prev, hp: en.hp }));
              await hitAnimation();
              if (en.hp <= 0) { handleVictory({ ...en }); ended = true; break; }
            } else if (sk.type === "boost") {
              addLog(`Masayaは「${sk.name}」！ Natsumiの攻撃力が上がった！`, "skill");
              boostFlagRef.current = true;
            }
          }
        }
      }

      // ────── 敵の行動 ──────
      else if (actor.id === "enemy") {
        await wait(420);

        // ターゲット決定
        let targetNatsumi = true;
        if (!pt.ko) {
          if (masayCovering) {
            // 庇うが有効: Natsumiへの攻撃をMasayaが肩代わり
            targetNatsumi = false;
            addLog(`Masayaが${en.name}の攻撃に割り込んだ！`, "system");
          } else {
            targetNatsumi = Math.random() < 0.65;
          }
        }

        if (targetNatsumi) {
          const dmg = calcPhys(en.attack, pl.defense);
          addLog(`${en.name}の攻撃！ Natsumiに${dmg}のダメージ！`, "damage");
          pl = { ...pl, hp: Math.max(0, pl.hp - dmg) };
          setPlayer(prev => ({ ...prev, hp: pl.hp }));
          if (pl.hp <= 0) {
            await wait(380);
            addLog("Natsumiは倒れてしまった…", "system");
            setPhase("gameover");
            ended = true;
          }
        } else {
          const dmg = calcPhys(en.attack, pt.defense ?? 30);
          addLog(`${en.name}の攻撃！ Masayaに${dmg}のダメージ！`, "damage");
          const newHp  = Math.max(0, pt.hp - dmg);
          const newKo  = newHp <= 0;
          pt = { ...pt, hp: newHp, ko: newKo };
          setPartner(prev => ({ ...prev, hp: pt.hp, ko: pt.ko }));
          if (newKo) {
            await wait(280);
            addLog("Masayaが倒れた！ でもNatsumiは戦い続ける！", "system");
          }
        }
      }
    } // end for

    if (!ended) setPhase("select_natsumi");
  }, [player, partner, enemy, addLog, hitAnimation, handleVictory]);

  // ─────────────────────────────────────────────────────────
  // コマンド選択ハンドラ
  // ─────────────────────────────────────────────────────────
  const gotoMasaya = useCallback((natAction) => {
    pendingNatRef.current = natAction;
    if (partner.ko) {
      // Masaya KO なら即実行
      executeAllActions(natAction, null);
    } else {
      setPhase("select_masaya");
    }
  }, [partner.ko, executeAllActions]);

  const handleNatFight        = useCallback(() => gotoMasaya({ type:"attack" }), [gotoMasaya]);
  const handleNatSkillSelect  = useCallback(sk  => gotoMasaya({ type:"skill", skill: sk }),  [gotoMasaya]);
  const handleNatItemSelect   = useCallback(it  => gotoMasaya({ type:"item",  item:  it }),  [gotoMasaya]);

  const handleMasFight        = useCallback(() => executeAllActions(pendingNatRef.current, { type:"attack" }), [executeAllActions]);
  const handleMasSkillSelect  = useCallback(sk  => executeAllActions(pendingNatRef.current, { type:"skill", skill: sk }), [executeAllActions]);

  // ─────────────────────────────────────────────────────────
  // 勝利後「つぎへ」
  // ─────────────────────────────────────────────────────────
  const handleVictoryNext = useCallback(() => {
    if (victoryInfo?.enemy) setPlayer(prev => ({ ...prev, exp: prev.exp + victoryInfo.enemy.exp }));
    if (SCENARIO[scenarioIdx]?.isFinal) { setScreen("ending"); return; }
    advanceScenario(scenarioIdx);
    setVictoryInfo(null);
    setPhase("select_natsumi");
  }, [victoryInfo, scenarioIdx, advanceScenario]);

  const handleRetry = useCallback(() => {
    setPlayer({ ...PLAYER_INITIAL });
    setPartner({ ...PARTNER_INITIAL });
    setItems(ITEMS_DATA.map(i => ({ ...i })));
    advanceScenario(-1);
  }, [advanceScenario]);

  // ─────────────────────────────────────────────────────────
  // レンダリング
  // ─────────────────────────────────────────────────────────
  const font = "'Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif";

  if (screen === "title") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none" }}>
      <TitleScreen onNewGame={startNewGame} onContinue={startContinue} onContinueFile={startContinueFile} />
    </div>
  );

  if (screen === "ending") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none" }}>
      <EndingScreen player={player} partner={partner} onTitle={goTitle} />
    </div>
  );

  // 会話パート
  if (currentEvent?.type === "dialogue") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none", background:"#05050f" }}>
      <SaveToast show={showToast} />
      <div style={{ padding:"5px 10px", background:"linear-gradient(135deg,#111827,#0f172a)", borderBottom:"1px solid #1e293b", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <button onClick={goTitle} style={{ background:"none", border:"none", color:"#fbbf24", fontSize:13, fontWeight:"bold", cursor:"pointer", padding:0 }}>🎮 Natsumi RPG</button>
        <button onClick={handleSave} style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:6, color:"#94a3b8", fontSize:10, padding:"3px 8px", cursor:"pointer" }}>💾</button>
      </div>
      <DialogueScreen
        key={scenarioIdx}
        event={currentEvent}
        player={player}
        partner={partner}
        onDone={handleDialogueDone}
        onGameOver={handleDialogueGameOver}
        onRetryBoss={handleRetryBoss}
        applyBondDelta={applyBondDelta}
        applyStatDelta={applyStatDelta}
        applyPartnerHpRestore={applyPartnerHpRestore}
        initialPageIdx={initDlgPage}
        initialBranchId={initDlgBranch}
        onStateChange={(pg, br) => { setDialoguePage(pg); setDialogueBranch(br); }}
      />
    </div>
  );

  // アイテムイベント
  if (currentEvent?.type === "item") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none", background:"#05050f" }}>
      <div style={{ padding:"5px 10px", background:"linear-gradient(135deg,#111827,#0f172a)", borderBottom:"1px solid #1e293b", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <button onClick={goTitle} style={{ background:"none", border:"none", color:"#fbbf24", fontSize:13, fontWeight:"bold", cursor:"pointer", padding:0 }}>🎮 Natsumi RPG</button>
      </div>
      <ItemEventScreen event={currentEvent} onDone={() => advanceScenario(scenarioIdx)} />
    </div>
  );

  // 勝利 / ゲームオーバー
  if (phase === "victory" && victoryInfo) return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none" }}>
      <VictoryScreen enemy={victoryInfo.enemy} expGained={victoryInfo.expGained} levelUpMsg={victoryInfo.levelUpMsg} onNext={handleVictoryNext} />
    </div>
  );
  if (phase === "gameover") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none" }}>
      <GameOverScreen onRetry={handleRetry} onTitle={goTitle} />
    </div>
  );

  // ─── バトル画面 ───────────────────────────────────────────
  const isExecuting = phase === "executing";

  const bottomMenu =
    phase === "select_natsumi_skill" ? <NatsumiSkillMenu player={player} partner={partner} onSelect={handleNatSkillSelect} onBack={() => setPhase("select_natsumi")} /> :
    phase === "select_natsumi_item"  ? <ItemMenu items={items} onSelect={handleNatItemSelect} onBack={() => setPhase("select_natsumi")} /> :
    phase === "select_masaya"        ? <MasayaCommandButtons partner={partner} onFight={handleMasFight} onSkill={() => setPhase("select_masaya_skill")} disabled={isExecuting} /> :
    phase === "select_masaya_skill"  ? <MasayaSkillMenu partner={partner} onSelect={handleMasSkillSelect} onBack={() => setPhase("select_masaya")} /> :
    <NatsumiCommandButtons onFight={handleNatFight} onSkill={() => setPhase("select_natsumi_skill")} onItem={() => setPhase("select_natsumi_item")} onSave={handleSave} onTitle={goTitle} disabled={isExecuting} />;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", fontFamily:font, userSelect:"none", background:"#05050f", position:"relative" }}>
      <SaveToast show={showToast} />

      {/* ヘッダー */}
      <div style={{ padding:"4px 10px", background:"linear-gradient(135deg,#111827,#0f172a)", borderBottom:"1px solid #1e293b", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <button onClick={goTitle} style={{ background:"none", border:"none", color:"#fbbf24", fontSize:13, fontWeight:"bold", cursor:"pointer", padding:0 }}>🎮 Natsumi RPG</button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <TurnOrderBadge player={player} partner={partner} enemy={enemy} />
          <span style={{ color:"#475569", fontSize:9 }}>{enemy?.boss ? "⚠️ BOSS" : `第${enemy?.chapter ?? "?"}章`}</span>
          <button onClick={() => { setDebugMode(p => !p); if (!debugMode && enemy) setEnemy(e => ({ ...e, hp:1 })); }} style={{ padding:"2px 6px", background: debugMode ? "#7f1d1d" : "#1e293b", border:`1px solid ${debugMode ? "#ef4444" : "#334155"}`, borderRadius:5, color: debugMode ? "#fca5a5" : "#475569", fontSize:9, fontWeight:"bold", cursor:"pointer" }}>
            {debugMode ? "🐛 ON" : "DBG"}
          </button>
        </div>
      </div>

      {/* ビジュアルエリア */}
      <div style={{ flex:"0 0 42%", display:"flex", flexDirection:"column", background:"linear-gradient(180deg,#0c1220,#05050f)", overflow:"hidden", borderBottom:"2px solid #1e293b" }}>
        {enemy && <EnemyArea    enemy={enemy} />}
        {enemy && <EnemyGraphic enemy={enemy} shaking={shaking} flashing={flashing} />}
        <PlayerStatus player={player} partner={partner} />
      </div>

      {/* ログ + コマンド */}
      <div style={{ flex:"1 1 0", display:"flex", flexDirection:"column", overflow:"hidden", minHeight:0 }}>
        <BattleLog logs={logs} logRef={logRef} />
        {bottomMenu}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
