import { Header } from './components/Header';
import { IdentityView } from './components/IdentityView';
import { StatusView } from './components/StatusView';
import { ActionView } from './components/ActionView';
import { LogView } from './components/LogView';
import { Footer } from './components/Footer';
import { CONTENT } from './constants/content';
import { useGameState } from './hooks/useGameState';

export default function App() {
  const {
    gameState,
    day,
    money,
    health,
    laborCount,
    timers,
    log,
    identity,
    flags,
    startGacha,
    handleAction,
  } = useGameState();

  return (
    <div className="bg-neutral-950 min-h-screen text-white p-4 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-md space-y-4">
        <Header day={day} />

        {gameState === 'GACHA' && (
          <div className="bg-neutral-800 p-8 border border-neutral-700 text-center space-y-6">
            <h2 className="text-lg font-bold">{CONTENT.GACHA.TITLE}</h2>
            <p className="text-sm text-neutral-400">{CONTENT.GACHA.DESC}</p>
            <button
              onClick={startGacha}
              className="bg-orange-600 w-full p-4 font-bold shadow-lg"
            >
              {CONTENT.GACHA.BUTTON}
            </button>
          </div>
        )}

        {gameState === 'TRAINING' && identity && (
          <>
            <IdentityView identity={identity} />
            <StatusView money={money} flags={flags} laborCount={laborCount} health={health} />
            <ActionView
              money={money}
              flags={flags}
              identity={identity}
              laborCount={laborCount}
              health={health}
              timers={timers}
              onAction={handleAction}
            />
            <LogView log={log} />
          </>
        )}

        {gameState === 'SUCCESS' && (
          <div className="bg-green-800 p-8 text-center border-2 border-green-400 shadow-2xl">
            <h2 className="text-2xl font-black italic">{CONTENT.SUCCESS.TITLE}</h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-white text-green-900 px-6 py-2 font-bold rounded-full"
            >
              {CONTENT.SUCCESS.RESTART}
            </button>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
