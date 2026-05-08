import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- 型定義 (TypeScript) ---
interface Ingredient {
  id: string;
  name: string;
  price: number;
  quality: number;
}

interface GameState {
  step: 'birth' | 'market' | 'cook' | 'result';
  budget: number;
  luck: number;
  skill: number;
  inventory: Ingredient[];
  quality: number;
  logs: string[];
  curryName: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: 'onion', name: "たまねぎ", price: 200, quality: 10 },
  { id: 'meat', name: "高級牛肉", price: 1500, quality: 40 },
  { id: 'pork', name: "豚こま切れ", price: 400, quality: 15 },
  { id: 'carrot', name: "にんじん", price: 150, quality: 5 },
  { id: 'spice', name: "特製スパイス", price: 800, quality: 25 },
];

export default function App() {
  const [state, setState] = useState<GameState>({
    step: 'birth',
    budget: 0,
    luck: 0,
    skill: 10,
    inventory: [],
    quality: 0,
    logs: ["システム起動。人生とカレーのシミュレーターへようこそ。"],
    curryName: "未完成の概念"
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  // ログが追加されたら自動スクロール
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.logs]);

  const addLog = (msg: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${msg}`]
    }));
  };

  // 1. 出生ガチャ
  const handleBirth = () => {
    const traits = [
      { name: "裕福な家庭", budget: 5000, luck: 80 },
      { name: "一般的な家庭", budget: 2000, luck: 50 },
      { name: "困窮した家庭", budget: 500, luck: 20 }
    ];
    const trait = traits[Math.floor(Math.random() * traits.length)];
    
    setState(prev => ({
      ...prev,
      step: 'market',
      budget: trait.budget,
      luck: trait.luck,
    }));
    addLog(`出生ガチャ：あなたは「${trait.name}」として生まれた。予算は${trait.budget}円。`);
  };

  // 2. 買い物
  const buyItem = (item: Ingredient) => {
    if (state.budget >= item.price) {
      setState(prev => ({
        ...prev,
        budget: prev.budget - item.price,
        inventory: [...prev.inventory, item],
        quality: prev.quality + item.quality
      }));
      addLog(`${item.name}を購入。`);
    } else {
      addLog("資金が足りない。これが社会の壁だ。");
    }
  };

  // 3. 調理
  const startCook = () => {
    setState(prev => ({ ...prev, step: 'cook' }));
    addLog("調理を開始。淡々と火を通す。");

    setTimeout(() => {
      const isSuccess = Math.random() * 100 < (state.luck + state.skill);
      const finalQuality = isSuccess ? state.quality + 10 : state.quality - 20;
      let name = "名もなき煮込み";
      if (finalQuality > 80) name = "至高のカレー";
      else if (finalQuality > 40) name = "普通のカレー";

      setState(prev => ({
        ...prev,
        step: 'result',
        quality: finalQuality,
        curryName: name
      }));
      addLog(`調理完了。${name}が完成した。`);
    }, 2000);
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="game-container">
      <header>
        <h1>Curry Scapegoat</h1>
        <div className="status-bar">
          資金: {state.budget}円 | 運: {state.luck} | 品質: {state.quality}
        </div>
      </header>

      <main>
        {state.step === 'birth' && (
          <section className="scene">
            <p>人生は最初のガチャで決まる部分が多い。</p>
            <button onClick={handleBirth}>出生ガチャを回す</button>
          </section>
        )}

        {state.step === 'market' && (
          <section className="scene">
            <h2>材料調達</h2>
            <div className="grid">
              {INGREDIENTS.map(item => (
                <button key={item.id} onClick={() => buyItem(item)}>
                  {item.name} ({item.price}円)
                </button>
              ))}
            </div>
            <button className="next-btn" onClick={startCook}>調理へ</button>
          </section>
        )}

        {state.step === 'cook' && (
          <section className="scene">
            <h2>調理中...</h2>
            <div className="spinner"></div>
          </section>
        )}

        {state.step === 'result' && (
          <section className="scene">
            <h2>結果: {state.curryName}</h2>
            <p>品質スコア: {state.quality}</p>
            <button onClick={resetGame}>もう一度人生をやり直す</button>
          </section>
        )}
      </main>

      <aside className="log-panel">
        <h3>観測ログ</h3>
        <div className="log-list">
          {state.logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
          <div ref={logEndRef} />
        </div>
      </aside>
    </div>
  );
}
