import { CONTENT } from '../constants/content';
import { SETTINGS } from '../constants/settings';
import type { ActionType, Flags, Identity, Timers } from '../types/game';

interface Props {
  money: number;
  flags: Flags;
  identity: Identity;
  laborCount: number;
  health: number;
  timers: Timers;
  onAction: (type: ActionType, amount?: number) => void;
}

export const ActionView = ({ money, flags, identity, laborCount, health, timers, onAction }: Props) => {
  const isCardActive = identity.myNumber === CONTENT.IDENTITY.MYNUMBER_ACTIVE;
  const isApplyingHouse = timers.house > 0;
  const isApplyingInfra = timers.infra > 0;
  const isApplyingMyNumber = timers.myNumber > 0;
  const { REQUIRED_FOR_KITCHEN } = SETTINGS.TRUST;

  return (
    <div className="grid grid-cols-1 gap-4 bg-neutral-900/50 p-4 border border-neutral-800 rounded">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-[9px] text-blue-400 font-bold ml-1">{CONTENT.ACTIONS.WORK_TIMEE_LABEL}</p>
          <button disabled={!isCardActive || health < 1 || isApplyingMyNumber} onClick={() => onAction('WORK_TIMEE', 1)} className="bg-blue-900/30 p-2 text-[10px] border border-blue-800 disabled:opacity-20 font-bold text-white">1日労働</button>
          <button disabled={!isCardActive || health < 5 || isApplyingMyNumber} onClick={() => onAction('WORK_TIMEE', 5)} className="bg-blue-900/30 p-2 text-[10px] border border-blue-800 disabled:opacity-20 font-bold text-white">5連勤</button>
          <button disabled={!isCardActive || health < 10 || isApplyingMyNumber} onClick={() => onAction('WORK_TIMEE', 10)} className="bg-blue-900/40 p-2 text-[10px] border border-blue-600 disabled:opacity-20 font-bold text-blue-100">10連勤</button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[9px] text-orange-400 font-bold ml-1">{CONTENT.ACTIONS.WORK_SUMIKOMI_LABEL}</p>
          <button disabled={health < 1} onClick={() => onAction('WORK_SUMIKOMI', 1)} className="bg-orange-900/30 p-2 text-[10px] border border-orange-800 font-bold text-white">1日労働</button>
          <button disabled={health < 5} onClick={() => onAction('WORK_SUMIKOMI', 5)} className="bg-orange-900/30 p-2 text-[10px] border border-orange-800 font-bold text-white">5連勤</button>
          <button disabled={health < 10} onClick={() => onAction('WORK_SUMIKOMI', 10)} className="bg-orange-900/40 p-2 text-[10px] border border-orange-600 font-bold text-orange-100">10連勤</button>
        </div>
      </div>

      <hr className="border-neutral-800" />

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onAction('REST_FREE')} className="bg-blue-600/20 p-2 text-[11px] border border-blue-500/50 text-blue-100 font-bold">
          {CONTENT.ACTIONS.REST_FREE}
        </button>
        <button disabled={money < SETTINGS.COST.REST_PAID} onClick={() => onAction('REST_PAID')} className="bg-pink-600/20 p-2 text-[11px] border border-pink-500/50 text-pink-100 font-bold disabled:opacity-30">
          {CONTENT.ACTIONS.REST_PAID}
        </button>
      </div>

      <hr className="border-neutral-800" />

      <div className="grid grid-cols-1 gap-2">
        {!flags.hasHouse && (
          <button
            disabled={health < 1 || isApplyingHouse || money < SETTINGS.COST.HOUSE_INIT}
            onClick={() => onAction('APPLY_HOUSE')}
            className="p-3 text-[11px] bg-neutral-800 border border-neutral-700 disabled:opacity-30 text-left font-bold text-white"
          >
            {isApplyingHouse ? CONTENT.ACTIONS.HOUSE_PENDING(timers.house) : CONTENT.ACTIONS.HOUSE_APPLY}
          </button>
        )}

        {flags.isSumikomi && !flags.canUseKitchen && (
          <button
            disabled={laborCount < REQUIRED_FOR_KITCHEN || health < 1}
            onClick={() => onAction('KITCHEN_NEGOTIATE')}
            className="p-3 text-[11px] bg-orange-900/40 border border-orange-700 disabled:opacity-30 text-left font-bold text-white"
          >
            {laborCount < REQUIRED_FOR_KITCHEN
              ? CONTENT.ACTIONS.KITCHEN_BUILDING_TRUST(REQUIRED_FOR_KITCHEN - laborCount)
              : CONTENT.ACTIONS.KITCHEN_NEGOTIATE}
          </button>
        )}

        {flags.hasHouse && !flags.hasGas && (
          <button
            disabled={health < 1 || isApplyingInfra}
            onClick={() => onAction('APPLY_INFRA')}
            className="p-3 text-[11px] bg-yellow-900/40 border border-yellow-700 disabled:opacity-30 text-left font-bold text-white"
          >
            {isApplyingInfra ? CONTENT.ACTIONS.INFRA_PENDING(timers.infra) : CONTENT.ACTIONS.INFRA_APPLY}
          </button>
        )}

        {!isCardActive && (
          <button
            disabled={health < 1 || isApplyingMyNumber}
            onClick={() => onAction('APPLY_MYNUMBER')}
            className="p-3 text-[11px] bg-blue-900/40 border border-blue-700 disabled:opacity-30 text-left font-bold text-white"
          >
            {isApplyingMyNumber ? CONTENT.ACTIONS.MYNUMBER_PENDING(timers.myNumber) : CONTENT.ACTIONS.MYNUMBER_APPLY}
          </button>
        )}

        {(flags.hasGas || flags.canUseKitchen) && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {!flags.hasCookware && (
              <button
                disabled={health < 1 || money < SETTINGS.COST.COOKWARE}
                onClick={() => onAction('BUY_TOOL')}
                className="p-2 text-[10px] bg-green-900/40 border border-green-700 text-green-100 font-bold disabled:opacity-30"
              >
                {CONTENT.ACTIONS.BUY_COOKWARE}
              </button>
            )}
            {!flags.hasIngredients && (
              <button
                disabled={money < SETTINGS.COST.INGREDIENTS}
                onClick={() => onAction('BUY_FOOD')}
                className="p-2 text-[10px] bg-green-900/40 border border-green-700 text-green-100 font-bold disabled:opacity-30"
              >
                {CONTENT.ACTIONS.BUY_FOOD}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
