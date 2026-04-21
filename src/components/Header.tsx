export const Header = ({ day }: { day: number }) => (
  <header className="border-b border-neutral-700 pb-2 flex justify-between items-end">
    <h1 className="text-xl font-black italic text-orange-500 tracking-tighter">
      CURRY SCAPEGOAT
    </h1>
    <div className="text-right">
      <p className="text-xl font-mono leading-none">Day {day}</p>
      <p className="text-[9px] text-orange-400 mt-1 uppercase">
        Survival Record
      </p>
    </div>
  </header>
);
