import { CONTENT } from '../constants/content';
import type { Identity } from '../types/game';

interface Props {
  identity: Identity;
}

export const IdentityView = ({ identity }: Props) => {
  const isActive = identity.myNumber === CONTENT.IDENTITY.MYNUMBER_ACTIVE;
  return (
    <div className="grid grid-cols-2 gap-2 text-[10px]">
      <div className="bg-neutral-800 p-2 border border-neutral-700">
        <p className="text-neutral-500 mb-1 uppercase">Parent Assets</p>
        <p className="font-bold text-neutral-200">{identity.parent.title}</p>
      </div>
      <div className="bg-neutral-800 p-2 border border-neutral-700">
        <p className="text-neutral-500 mb-1 uppercase">ID Status</p>
        <p className={`font-bold ${isActive ? 'text-blue-400' : 'text-red-500'}`}>
          MyNumber:{identity.myNumber}
        </p>
      </div>
    </div>
  );
};
