import { useState, useEffect } from 'react'

// --- 型定義 ---
type Step = 'birth' | 'life' | 'cooking' | 'result';

interface State {
  step: Step;
  money: number;
  health: number;
  luckType: string;
  daysPassed: number;
  logs: string[];
  infrastructure: {
    myNumber: number; // 完了まで45日
    apartment: number; // 完了まで90日
    energy: number;    // 完了まで14日
  };
  inventory: string[];
}

export default function App() {
  const [state, setState] = useState<State>({
    step: 'birth',
    money: 0,
    health: 10,
    luckType: '',
    daysPassed: 0,
    logs: ['シミュレーターを起動しました。'],
    infrastructure: { myNumber: 0, apartment: 0, energy: 0 },
    inventory: []
  });

  const addLog = (msg: string) => {
    setState(prev => ({ ...prev, logs: [`[Day ${prev.daysPassed}] ${msg}`, ...prev.logs].slice(0, 50) }));
  };

  // 1. 出生ガチャ (READMEの確率に基づく)
  const rollBirth = () => {
    const rnd = Math.random() * 100;
    let result = { type: 'N 困窮/絶縁', money: 0 };
    if (rnd < 5) result = { type: 'SSR 資産家', money: 3000000 };
    else if (rnd < 25) result = { type: 'SR 安定層', money: 400000 };
    else if (rnd < 70) result = { type: 'R ギリギリ層', money: 50000 };

    setState(prev => ({
      ...prev,
      step: 'life',
      money: result.money,
      luckType: result.type
    }));
    addLog(`出生確定：${result.type}。所持金 ${result.money.toLocaleString()}円から開始。`);
  };

  // 2. 日常の進行 (1日経過)
  const nextDay = (action: 'work_timee' | 'work_livein' | 'rest' | 'apply') => {
    setState(prev => {
      let nMoney = prev.money;
      let nHealth = prev.health;
      let nInfra = { ...prev.infrastructure };
      const cost = 1000 + Math.floor(Math.random() * 901); // 生存コスト 1000-1900円

      // アクション処理
      if (action === 'work_timee') {
        nMoney += 9800;
        nHealth -= 3;
      } else if (action === 'work_livein') {
        nMoney += 14000;
        nHealth -= 5;
      } else if (action === 'rest') {
        nHealth = Math.min(30, nHealth + 5);
      } else if (action === 'apply') {
        if (nInfra.myNumber === 0) nInfra.myNumber = 45;
        else if (nInfra.apartment === 0) nInfra.apartment = 90;
        else if (nInfra.energy === 0) nInfra.energy = 14;
      }

      // インフラのカウントダウン
      if (nInfra.myNumber > 0) nInfra.myNumber--;
      if (nInfra.apartment > 0) nInfra.apartment--;
      if (nInfra.energy > 0) nInfra.energy--;

      nMoney -= cost;

      if (nHealth <= 0 || nMoney < 0) {
        return { ...prev, step: 'result', logs: ['生存不能になりました。', ...prev.logs] };
      }

      return {
        ...prev,
        daysPassed: prev.daysPassed + 1,
        money: nMoney,
        health: nHealth,
        infrastructure: nInfra
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-mono">
      <div className="max-w-md mx-auto bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        <header className="bg-orange-600 p-4 shadow-md">
          <h1 className="text-xl font-bold">Curry Scapegoat</h1>
          <div className="flex justify-between text-sm mt-2">
            <span>💰 {state.money.toLocaleString()}円</span>
            <span>❤️ {state.health}/30</span>
            <span>📅 {state.daysPassed}日目</span>
          </div>
        </header>

        <main className="p-4 space-y-4">
          {state.step === 'birth' && (
            <div className="text-center py-10">
              <p className="mb-6 text-slate-400">人生の前提を統計的に決定します。</p>
              <button onClick={rollBirth} className="bg-orange-500 hover:bg-orange-400 px-8 py-3 rounded-full font-bold transition">出生ガチャを回す</button>
            </div>
          )}

          {state.step === 'life' && (
            <div className="space-y-4">
              <div className="bg-slate-700 p-3 rounded text-sm">
                <p>現在の身分: <span className="text-orange-400">{state.luckType}</span></p>
                <div className="mt-2 text-xs text-slate-400">
                  インフラ待機: MN({state.infrastructure.myNumber}) 居({state.infrastructure.apartment}) ⚡({state.infrastructure.energy})
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => nextDay('work_timee')} className="bg-blue-600 p-2 rounded text-sm hover:bg-blue-500">タイミー (-3❤️/+9.8k)</button>
                <button onClick={() => nextDay('work_livein')} className="bg-purple-600 p-2 rounded text-sm hover:bg-purple-500">住み込み (-5❤️/+14k)</button>
                <button onClick={() => nextDay('apply')} className="bg-emerald-600 p-2 rounded text-sm hover:bg-emerald-500">役所・契約手続</button>
                <button onClick={() => nextDay('rest')} className="bg-slate-600 p-2 rounded text-sm hover:bg-slate-500">休息 (+5❤️)</button>
              </div>

              {state.infrastructure.energy === 0 && state.daysPassed > 0 && (
                <button className="w-full bg-orange-600 p-3 rounded font-bold animate-bounce">🍛 カレーを作る</button>
              )}
            </div>
          )}

          {state.step === 'result' && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-red-500 mb-4">GAME OVER</h2>
              <p className="mb-6">カレーに辿り着く前に、社会的な生存が終了しました。</p>
              <button onClick={() => window.location.reload()} className="text-orange-400 underline">もう一度最初から</button>
            </div>
          )}
        </main>

        <footer className="bg-black p-4 h-48 overflow-y-auto text-xs space-y-1 border-t border-slate-700">
          {state.logs.map((log, i) => <div key={i} className={i === 0 ? "text-orange-400" : "text-slate-500"}>{log}</div>)}
        </footer>
      </div>
    </div>
  );
}
