interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  iconBgColor,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
  >
    <div className={`${iconBgColor} p-4 rounded-full mb-4`}>{icon}</div>
    <h2 className="text-xl font-semibold text-stone-800 mb-2">{title}</h2>
    <p className="text-stone-500 text-center">{description}</p>
  </button>
);

export default ActionCard;
