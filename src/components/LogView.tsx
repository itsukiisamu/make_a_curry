import { BookOpen } from 'lucide-react';

interface Props {
  log: string[];
}

export const LogView = ({ log }: Props) => (
  <div className="border border-neutral-800 bg-black flex flex-col shadow-inner">
    <div className="bg-neutral-800/50 px-3 py-1 border-b border-neutral-800 flex justify-between items-center">
      <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
        <BookOpen size={10} /> Survival Diary
      </h3>
    </div>
    <div className="p-3 h-32 overflow-y-auto font-mono">
      {log.map((entry, i) => (
        <p
          key={i}
          className={`text-[10px] mb-1 ${
            i === 0 ? 'text-orange-400' : 'text-neutral-600'
          }`}
        >
          {entry}
        </p>
      ))}
    </div>
  </div>
);
