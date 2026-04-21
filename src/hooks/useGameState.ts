import { useState, useEffect } from 'react';
import { SETTINGS } from '../constants/settings';
import { CONTENT } from '../constants/content';
import type { GameState, ActionType, Identity, Flags, Timers, GameStateReturn } from '../types/game';

const INITIAL_FLAGS: Flags = {
  hasHouse: false,
  hasWater: false,
  hasElectricity: false,
  hasGas: false,
  hasCookware: false,
  hasIngredients: false,
  isSumikomi: false,
  canUseKitchen: false,
};

const INITIAL_TIMERS: Timers = { myNumber: 0, infra: 0, house: 0 };

export const useGameState = (): GameStateReturn => {
  const [gameState, setGameState] = useState<GameState>('GACHA');
  const [day, setDay] = useState(0);
  const [money, setMoney] = useState(0);
  const [health, setHealth] = useState(SETTINGS.HEALTH.INITIAL);
  const [laborCount, setLaborCount] = useState(0);
  const [timers, setTimers] = useState<Timers>(INITIAL_TIMERS);
  const [log, setLog] = useState<string[]>([]);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [flags, setFlags] = useState<Flags>(INITIAL_FLAGS);

  const startGacha = () => {
    const rand = Math.random() * 100;
    const { SSR_THRESHOLD, SR_THRESHOLD, SSR_GIFT, SR_GIFT, R_GIFT, N_GIFT } = SETTINGS.GACHA;
    const { SSR_TITLE, SR_TITLE, R_TITLE, N_TITLE, MYNUMBER_PENDING } = CONTENT.IDENTITY;

    const parent =
      rand < SSR_THRESHOLD ? { title: SSR_TITLE, gift: SSR_GIFT } :
      rand < SR_THRESHOLD  ? { title: SR_TITLE,  gift: SR_GIFT  } :
      rand < 70            ? { title: R_TITLE,   gift: R_GIFT   } :
                             { title: N_TITLE,   gift: N_GIFT   };

    setIdentity({ parent, myNumber: MYNUMBER_PENDING });
    setMoney(parent.gift);
    setLog([CONTENT.LOG.PROLOGUE]);
    setGameState('TRAINING');
  };

  const handleAction = (type: ActionType, amount: number = 1) => {
    const S = SETTINGS;
    let days = amount;
    let msg = '';
    let healthDelta = 0;
    let directCost = 0;
    const timerOverrides: Partial<Timers> = {};

    switch (type) {
      case 'REST_FREE':
        healthDelta = S.HEALTH.REST_FREE_GAIN;
        days = 1;
        msg = '休息した。';
        break;
      case 'REST_PAID':
        directCost = S.COST.REST_PAID;
        healthDelta = S.HEALTH.REST_PAID_GAIN;
        days = 1;
        msg = '高級な癒やしを得た。';
        break;
      case 'WORK_TIMEE':
        setMoney(m => m + S.PAY.TIMEE_PER_DAY * amount);
        setLaborCount(l => l + amount);
        healthDelta = -amount;
        msg = `${amount}日間タイミー労働。`;
        break;
      case 'WORK_SUMIKOMI':
        setMoney(m => m + S.PAY.SUMIKOMI_PER_DAY * amount);
        setLaborCount(l => l + amount);
        healthDelta = -amount;
        setFlags(f => ({ ...f, isSumikomi: true, hasWater: true, hasElectricity: true, hasGas: true }));
        msg = `${amount}日間住み込み労働。`;
        break;
      case 'APPLY_MYNUMBER':
        timerOverrides.myNumber = S.WAIT_DAYS.MYNUMBER;
        healthDelta = -S.HEALTH.ACTION_COST;
        days = 1;
        msg = 'マイナカード申請。';
        break;
      case 'APPLY_INFRA':
        timerOverrides.infra = S.WAIT_DAYS.INFRA;
        healthDelta = -S.HEALTH.ACTION_COST;
        days = 1;
        msg = 'インフラ開通申請。';
        break;
      case 'APPLY_HOUSE':
        directCost = S.COST.HOUSE_INIT;
        timerOverrides.house = S.WAIT_DAYS.HOUSE_MOVE;
        healthDelta = -S.HEALTH.ACTION_COST;
        days = 1;
        msg = 'アパート契約！待機90日。';
        break;
      case 'BUY_TOOL':
        directCost = S.COST.COOKWARE;
        setFlags(f => ({ ...f, hasCookware: true }));
        healthDelta = -S.HEALTH.ACTION_COST;
        days = 1;
        msg = '調理器具を購入。';
        break;
      case 'BUY_FOOD':
        directCost = S.COST.INGREDIENTS;
        setFlags(f => ({ ...f, hasIngredients: true }));
        msg = '食材を購入。';
        break;
      case 'KITCHEN_NEGOTIATE':
        setFlags(f => ({ ...f, canUseKitchen: true }));
        healthDelta = -S.HEALTH.ACTION_COST;
        days = 1;
        msg = 'キッチン交渉成立！';
        break;
    }

    if (money < directCost) {
      setLog(prev => [CONTENT.ACTIONS.INSUFFICIENT_FUNDS, ...prev]);
      return;
    }

    setTimers(prev => {
      const next: Timers = {
        myNumber: Math.max(0, (timerOverrides.myNumber ?? prev.myNumber) - days),
        infra:    Math.max(0, (timerOverrides.infra    ?? prev.infra)    - days),
        house:    Math.max(0, (timerOverrides.house    ?? prev.house)    - days),
      };
      if (prev.myNumber > 0 && next.myNumber === 0) {
        setIdentity(i => i ? { ...i, myNumber: CONTENT.IDENTITY.MYNUMBER_ACTIVE } : i);
      }
      if (prev.infra > 0 && next.infra === 0) {
        setFlags(f => ({ ...f, hasGas: true, hasWater: true, hasElectricity: true }));
      }
      if (prev.house > 0 && next.house === 0) {
        setFlags(f => ({
          ...f,
          hasHouse: true,
          isSumikomi: false,
          hasWater: false,
          hasElectricity: false,
          hasGas: false,
          canUseKitchen: false,
        }));
      }
      return next;
    });

    const survivalRate = flags.isSumikomi
      ? S.COST.SUMIKOMI_SURVIVAL_PER_DAY
      : S.COST.NORMAL_SURVIVAL_PER_DAY;
    const totalCost = directCost + survivalRate * days;

    setMoney(m => m - totalCost);
    setHealth(h => Math.min(Math.max(h + healthDelta, 0), S.HEALTH.MAX));
    setLog(prev => [`Day ${day + days}: ${msg} (計-¥${totalCost.toLocaleString()})`, ...prev]);
    setDay(d => d + days);
  };

  useEffect(() => {
    if (flags.hasCookware && flags.hasIngredients && (flags.hasGas || flags.canUseKitchen)) {
      setGameState('SUCCESS');
    }
  }, [flags]);

  return { gameState, day, money, health, laborCount, timers, log, identity, flags, startGacha, handleAction };
};
