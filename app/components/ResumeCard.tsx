import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { auth, fs } = usePuterStore();

  useEffect(() => {
    const loadResumes = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResumes();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-500"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="font-bold break-words" style={{ color: '#8aba89' }}>{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words" style={{ color: '#8aba89' }}>{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="font-bold" style={{ color: '#8aba89' }}>Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl ? (
        <div className="gradient-border animate-in fade-in duration-300">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="Resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      ) : (
        <div className="gradient-border animate-in fade-in duration-300">
          <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface1)' }}>
            <span style={{ color: 'var(--color-subtext0)' }}>Loading...</span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
