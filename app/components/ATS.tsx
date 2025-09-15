interface ATSProps {
  score: number;
  suggestions: {
    type: "good" | "improve";
    tip: string;
  }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  const getBackgroundGradient = () => {
    if (score > 69) return "bg-gradient-to-br from-green-900/50 to-green-800/50";
    if (score > 49) return "bg-gradient-to-br from-yellow-900/50 to-yellow-800/50";
    return "bg-gradient-to-br from-red-900/50 to-red-800/50";
  };

  const getATSIcon = () => {
    if (score > 69) return "/icons/ats-good.svg";
    if (score > 49) return "/icons/ats-warning.svg";
    return "/icons/ats-bad.svg";
  };

  const getSuggestionIcon = (type: "good" | "improve") => {
    return type === "good" ? "/icons/check.svg" : "/icons/warning.svg";
  };

  return (
    <div className={`rounded-lg p-6 shadow-lg bg-slate-800 ${getBackgroundGradient()}`}>
      <div className="flex items-center gap-4 mb-4">
        <img src={getATSIcon()} alt="ATS Status" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            ATS Score: {score}/100
          </h2>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          Applicant Tracking System Analysis
        </h3>
        <p className="text-slate-300">
          Your resume has been analyzed for ATS compatibility. This score
          reflects how well your resume will perform when processed by automated
          hiring systems.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold text-slate-200 mb-3">
          Suggestions:
        </h4>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <img
                src={getSuggestionIcon(suggestion.type)}
                alt={suggestion.type}
                className="w-5 h-5 mt-0.5 flex-shrink-0"
              />
              <span className="text-slate-300">{suggestion.tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <p className="text-slate-300 font-medium">
          Keep improving your resume to increase your chances of getting noticed
          by employers!
        </p>
      </div>
    </div>
  );
};

export default ATS;
