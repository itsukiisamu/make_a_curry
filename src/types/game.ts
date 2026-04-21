export type GameState = 'GACHA' | 'TRAINING' | 'SUCCESS';

export type ActionType =
  | 'REST_FREE'
  | 'REST_PAID'
  | 'WORK_TIMEE'
  | 'WORK_SUMIKOMI'
  | 'APPLY_MYNUMBER'
  | 'APPLY_INFRA'
  | 'APPLY_HOUSE'
  | 'BUY_TOOL'
  | 'BUY_FOOD'
  | 'KITCHEN_NEGOTIATE';

export interface ParentBackground {
  title: string;
  gift: number;
}

export interface Identity {
  parent: ParentBackground;
  myNumber: string;
}

export interface Flags {
  hasHouse: boolean;
  hasWater: boolean;
  hasElectricity: boolean;
  hasGas: boolean;
  hasCookware: boolean;
  hasIngredients: boolean;
  isSumikomi: boolean;
  canUseKitchen: boolean;
}

export interface Timers {
  myNumber: number;
  infra: number;
  house: number;
}

export interface GameStateReturn {
  gameState: GameState;
  day: number;
  money: number;
  health: number;
  laborCount: number;
  timers: Timers;
  log: string[];
  identity: Identity | null;
  flags: Flags;
  startGacha: () => void;
  handleAction: (type: ActionType, amount?: number) => void;
}
