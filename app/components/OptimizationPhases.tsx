import { OptimizationWorkflow } from "~/lib/optimizationWorkflow";

interface OptimizationPhasesProps {
  resumeModel: ResumeModel | null;
  onStartOptimization: () => void;
  isOptimizing: boolean;
}

const OptimizationPhases = ({
  resumeModel,
  onStartOptimization,
  isOptimizing,
}: OptimizationPhasesProps) => {
  if (!resumeModel) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text)" }}>Resume Optimization</h3>
        <p style={{ color: "var(--color-secondary)" }}>Loading optimization data...</p>
      </div>
    );
  }

  const currentSession = resumeModel.optimization.optimizationHistory[0];
  const progress = currentSession
    ? OptimizationWorkflow.getOptimizationProgress(
        resumeModel,
        currentSession.id,
      )
    : {
        completedPhases: 0,
        totalPhases: 7,
        currentPhase: null,
        scoreImprovement: 0,
      };

  const phases = [
    {
      phase: "blindSpot",
      name: "Blind Spot Analysis",
      description: "Identify what recruiters look for but might be missing",
      icon: "🔍",
    },
    {
      phase: "summary",
      name: "Summary Optimization",
      description: "Craft a compelling, job-tailored summary",
      icon: "✨",
    },
    {
      phase: "achievements",
      name: "Achievement Focus",
      description: "Transform responsibilities into measurable achievements",
      icon: "🎯",
    },
    {
      phase: "gaps",
      name: "Gap Reframing",
      description: "Turn weaknesses into growth opportunities",
      icon: "🌱",
    },
    {
      phase: "ats",
      name: "ATS Optimization",
      description: "Add relevant keywords naturally",
      icon: "🤖",
    },
    {
      phase: "formatting",
      name: "Format & Structure",
      description: "Ensure clean, scannable formatting",
      icon: "📄",
    },
    {
      phase: "outreach",
      name: "Outreach Message",
      description: "Create compelling hiring manager outreach",
      icon: "💌",
    },
  ];

  const hasStartedOptimization =
    currentSession && currentSession.phases.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Resume Optimization</h3>
          <p className="text-sm mt-1" style={{ color: "var(--color-secondary)" }}>
            7-phase system based on proven strategies
          </p>
        </div>
        {!hasStartedOptimization && (
          <button
            onClick={onStartOptimization}
            disabled={isOptimizing}
            className="primary-button"
          >
            {isOptimizing ? "Starting..." : "Start Optimization"}
          </button>
        )}
      </div>

      {hasStartedOptimization && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "var(--color-bg-alt)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--color-accent-blue)" }}>
              Progress: {progress.completedPhases}/{progress.totalPhases} phases
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--color-accent-teal)" }}>
              +{progress.scoreImprovement} points
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: "var(--color-secondary)" }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(progress.completedPhases / progress.totalPhases) * 100}%`,
                background: `linear-gradient(to right, var(--color-accent-blue), var(--color-accent-teal))`,
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {phases.map((phase, index) => {
          const isCompleted =
            hasStartedOptimization &&
            currentSession?.phases.find((p) => p.phase === phase.phase)
              ?.completed;
          const isCurrent = progress.currentPhase === phase.phase;

          return (
            <div
              key={phase.phase}
              className={`flex items-center p-4 rounded-lg transition-all ${
                isCompleted
                  ? "border-2"
                  : isCurrent
                    ? "border-2"
                    : "border"
              }`}
              style={{
                backgroundColor: isCompleted
                  ? "rgba(51, 201, 181, 0.1)"
                  : isCurrent
                    ? "rgba(83, 165, 244, 0.1)"
                    : "var(--color-bg-alt)",
                borderColor: isCompleted
                  ? "var(--color-accent-teal)"
                  : isCurrent
                    ? "var(--color-accent-blue)"
                    : "var(--color-secondary)",
              }}
            >
              <div className="flex-shrink-0 mr-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white"
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--color-accent-teal)"
                      : isCurrent
                        ? "var(--color-accent-blue)"
                        : "var(--color-secondary)",
                  }}
                >
                  {isCompleted ? "✓" : isCurrent ? phase.icon : index + 1}
                </div>
              </div>
              <div className="flex-grow">
                <h4
                  className="font-medium"
                  style={{
                    color: isCompleted || isCurrent
                      ? "var(--color-text)"
                      : "var(--color-text)",
                  }}
                >
                  {phase.name}
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: isCompleted || isCurrent
                      ? "var(--color-text)"
                      : "var(--color-secondary)",
                  }}
                >
                  {phase.description}
                </p>
              </div>
              {isCurrent && (
                <div className="flex-shrink-0 ml-4">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(83, 165, 244, 0.2)",
                      color: "var(--color-accent-blue)",
                    }}
                  >
                    Current
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasStartedOptimization && (
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() =>
              (window.location.href = `/resume/${resumeModel.id}/optimize`)
            }
            className="primary-button w-full"
          >
            Continue Optimization
          </button>
        </div>
      )}
    </div>
  );
};

export default OptimizationPhases;
