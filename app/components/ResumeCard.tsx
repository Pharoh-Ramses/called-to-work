import { Link, useNavigate } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { prepareInstructions } from "constants/index";
import { ResumeParser } from "~/lib/resumeParser";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
  onReanalysisStart,
  onReanalysisComplete,
  isReanalyzing: externalIsReanalyzing,
}: {
  resume: Resume;
  onReanalysisStart?: (resumeId: string) => void;
  onReanalysisComplete?: (resumeId: string) => void;
  isReanalyzing?: boolean;
}) => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [internalIsReanalyzing, setInternalIsReanalyzing] = useState(false);
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const isReanalyzing = externalIsReanalyzing || internalIsReanalyzing;

  useEffect(() => {
    const loadResumes = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResumes();
  }, [imagePath]);

  const handleReanalysis = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to resume page
    e.stopPropagation();

    if (!companyName || !jobTitle) {
      alert("Company name and job title are required for reanalysis");
      return;
    }

    setInternalIsReanalyzing(true);
    if (onReanalysisStart) {
      onReanalysisStart(id);
    }

    try {
      // Get the original resume data
      const resumeData = await kv.get(`resume:${id}`);
      if (!resumeData) {
        throw new Error("Resume data not found");
      }

      const data = JSON.parse(resumeData) as ResumeData;

      // Reanalyze with AI
      const feedback = await ai.feedback(
        data.resumePath,
        prepareInstructions({
          jobTitle: data.jobTitle || jobTitle,
          jobDescription: data.jobDescription || "",
        }),
      );

      if (!feedback) {
        throw new Error("Failed to get AI feedback");
      }

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      console.log("Reanalysis - Raw AI Response:", feedbackText);

      // Update the stored data
      try {
        data.feedback = JSON.parse(feedbackText);
        console.log("Reanalysis - Parsed feedback:", data.feedback);
      } catch (parseError) {
        console.error("Reanalysis - Failed to parse AI response:", parseError);
        throw new Error("Failed to parse AI response");
      }
      await kv.set(`resume:${id}`, JSON.stringify(data));

      // Create/update structured resume model
      let resumeModel: ResumeModel;
      try {
        const parsed = JSON.parse(feedbackText);
        if (parsed.feedback && parsed.extractedData) {
          // Enhanced response format
          resumeModel = ResumeParser.parseEnhancedAIResponse(feedbackText, id, {
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
          });
        } else {
          // Legacy format
          resumeModel = ResumeParser.parseAIFeedbackToResumeModel(
            feedbackText,
            id,
            {
              companyName: data.companyName,
              jobTitle: data.jobTitle,
              jobDescription: data.jobDescription,
            },
          );
        }
      } catch {
        // Fallback to legacy parsing
        resumeModel = ResumeParser.parseAIFeedbackToResumeModel(
          feedbackText,
          id,
          {
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
          },
        );
      }

      await kv.set(`resume_model:${id}`, JSON.stringify(resumeModel));

      // Notify parent component
      if (onReanalysisComplete) {
        onReanalysisComplete(id);
      }

      // Navigate to the resume page to show updated results
      navigate(`/resume/${id}`);
    } catch (error) {
      console.error("Reanalysis failed:", error);
      alert("Failed to reanalyze resume. Please try again.");
    } finally {
      setInternalIsReanalyzing(false);
    }
  };

  return (
    <div className="resume-card animate-in fade-in duration-1000 relative">
      <Link to={`/resume/${id}`} className="block">
        <div className="resume-card-header">
          <div className="flex flex-col gap-2">
            {companyName && (
              <h2
                className="font-bold break-words"
                style={{ color: "var(--color-text)" }}
              >
                {companyName}
              </h2>
            )}
            {jobTitle && (
              <h3
                className="text-lg break-words"
                style={{ color: "var(--color-secondary)" }}
              >
                {jobTitle}
              </h3>
            )}
            {!companyName && !jobTitle && (
              <h2 className="font-bold" style={{ color: "var(--color-text)" }}>
                Resume
              </h2>
            )}
          </div>
          <div className="flex-shrink-0">
            <ScoreCircle score={feedback.overallScore || 0} />
          </div>
        </div>
        {resumeUrl && (
          <div className="gradient-border animate-in fade-in duration-1000">
            <div className="w-full h-full">
              <img
                src={resumeUrl}
                alt="Resume"
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
              />
            </div>
          </div>
        )}
      </Link>

      {/* Reanalysis Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleReanalysis}
          disabled={isReanalyzing}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
            isReanalyzing
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
          }`}
          title="Reanalyze this resume with latest AI"
        >
          {isReanalyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing...
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>🔄</span>
              Reanalyze
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;
