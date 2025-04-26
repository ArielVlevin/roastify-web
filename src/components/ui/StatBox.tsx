interface StatBoxProps {
  label: string;
  value: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value }) => (
  <div className="bg-stone-100 p-3 rounded-lg">
    <div className="text-sm text-stone-500">{label}</div>
    <div className="text-xl font-bold text-stone-800">{value}</div>
  </div>
);

// Helper component for crack status
interface CrackStatusBoxProps {
  first: boolean;
  second: boolean;
}

const CrackStatusBox: React.FC<CrackStatusBoxProps> = ({ first, second }) => (
  <div className="bg-stone-100 p-3 rounded-lg">
    <div className="text-sm text-stone-500">Crack Status</div>
    <div className="text-base font-bold">
      <span className={first ? "text-amber-500" : "text-stone-400"}>1st</span>
      {" / "}
      <span className={second ? "text-red-600" : "text-stone-400"}>2nd</span>
    </div>
  </div>
);

export { StatBox, CrackStatusBox };
