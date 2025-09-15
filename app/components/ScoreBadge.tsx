const ScoreBadge = ({ score }: { score: number }) => {
  const getBadgeStyles = () => {
    if (score > 69) {
      return {
        bgColor: "bg-badge-green",
        textColor: "text-green-400",
        label: "strong",
      };
    } else if (score > 49) {
      return {
        bgColor: "bg-badge-yellow",
        textColor: "text-yellow-400",
        label: "good start",
      };
    } else {
      return {
        bgColor: "bg-badge-red",
        textColor: "text-red-400",
        label: "needs work",
      };
    }
  };

  const { bgColor, textColor, label } = getBadgeStyles();

  return (
    <div
      className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-medium`}
    >
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;
