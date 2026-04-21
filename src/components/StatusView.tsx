import { Hop as Home, Droplets, Zap, Flame, ShoppingCart, Heart } from 'lucide-react';
import { SETTINGS } from '../constants/settings';
import { CONTENT } from '../constants/content';
import type { Flags } from '../types/game';

interface Props {
  money: number;
  flags: Flags;
  laborCount: number;
  health: number;
}

interface IconBoxProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const IconBox = ({ icon, label, active }: IconBoxProps) => (
  <div className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-orange-500' : 'text-neutral-800'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </div>
);

export const StatusView = ({ money, flags, laborCount, health }: Props) => (
  <div className="bg-black p-4 border border-neutral-800 space-y-4">
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[10px] text-neutral-500 uppercase font-bold">{CONTENT.STATUS.MONEY_LABEL}</p>
        <p className="text-3xl font-mono text-green-400 leading-none">¥{money.toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-neutral-500 uppercase flex items-center justify-end gap-1 mb-1 font-bold">
          <Heart size={10} className="text-red-500 fill-current" /> {CONTENT.STATUS.HEALTH_LABEL}
        </p>
        <p className="text-2xl font-mono font-bold leading-none">
          <span className={health <= 3 ? 'text-red-500 animate-pulse' : 'text-white'}>{health}</span>
          <span className="text-neutral-600 text-sm italic"> / {SETTINGS.HEALTH.MAX}</span>
        </p>
      </div>
    </div>

    <div className="flex justify-between items-start border-t border-neutral-900 pt-3">
      <div className="grid grid-cols-10 gap-0.5">
        {[...Array(SETTINGS.HEALTH.MAX)].map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-sm ${
              i < health ? 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]' : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>
      {flags.isSumikomi && !flags.hasHouse && (
        <div className="text-right">
          <p className="text-[8px] text-neutral-500 uppercase font-bold">{CONTENT.STATUS.TRUST_LABEL}</p>
          <p className="text-sm font-bold text-orange-400 italic">
            {laborCount}{' '}
            <span className="text-[10px] text-neutral-600 font-normal">
              / {SETTINGS.TRUST.REQUIRED_FOR_KITCHEN}日
            </span>
          </p>
        </div>
      )}
    </div>

    <div className="flex justify-between px-2 pt-2 border-t border-neutral-900">
      <IconBox icon={<Home size={18} />} label={CONTENT.STATUS.ICONS.HOME} active={flags.hasHouse || flags.isSumikomi} />
      <IconBox icon={<Droplets size={18} />} label={CONTENT.STATUS.ICONS.WATER} active={flags.hasWater} />
      <IconBox icon={<Zap size={18} />} label={CONTENT.STATUS.ICONS.ELECTRICITY} active={flags.hasElectricity} />
      <IconBox icon={<Flame size={18} />} label={CONTENT.STATUS.ICONS.GAS} active={flags.hasGas || flags.canUseKitchen} />
      <IconBox icon={<ShoppingCart size={18} />} label={CONTENT.STATUS.ICONS.INGREDIENTS} active={flags.hasIngredients} />
    </div>
  </div>
);
