import { RotateCcw } from 'lucide-react';
import { CONTENT } from '../constants/content';

export const Footer = () => (
  <footer className="pt-8 pb-4 flex flex-col items-center space-y-4">
    <p className="text-[9px] text-neutral-700 text-center tracking-tighter leading-tight">
      {CONTENT.FOOTER.TAGLINE}
      <br />{CONTENT.FOOTER.COPYRIGHT}
    </p>
    <button
      onClick={() =>
        window.confirm(CONTENT.FOOTER.RESET_CONFIRM) && window.location.reload()
      }
      className="flex items-center gap-2 text-[10px] text-neutral-600 hover:text-red-500 transition-colors border border-neutral-800 px-4 py-1.5 rounded-full"
    >
      <RotateCcw size={10} /> {CONTENT.FOOTER.RESET_BUTTON}
    </button>
  </footer>
);
