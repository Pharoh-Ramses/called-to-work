interface ResumeDataDisplayProps {
  resumeModel: ResumeModel | null;
}

const ResumeDataDisplay = ({ resumeModel }: ResumeDataDisplayProps) => {
  if (!resumeModel) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          Extracted Resume Data
        </h3>
        <p style={{ color: "var(--color-secondary)" }}>No structured data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: "var(--color-text)" }}>
          <span className="mr-2">👤</span>
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>
              Full Name
            </label>
            <p style={{ color: "var(--color-text)" }}>
              {resumeModel.personalInfo.fullName || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>Email</label>
            <p style={{ color: "var(--color-text)" }}>
              {resumeModel.personalInfo.email || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>Phone</label>
            <p style={{ color: "var(--color-text)" }}>
              {resumeModel.personalInfo.phone || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>
              Location
            </label>
            <p style={{ color: "var(--color-text)" }}>
              {resumeModel.personalInfo.location || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: "var(--color-text)" }}>
          <span className="mr-2">📝</span>
          Professional Summary
        </h3>
        <p className="mb-4" style={{ color: "var(--color-text)" }}>
          {resumeModel.summary.content || "No summary provided"}
        </p>
        {resumeModel.summary.keyStrengths.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block" style={{ color: "var(--color-secondary)" }}>
              Key Strengths
            </label>
            <div className="flex flex-wrap gap-2">
              {resumeModel.summary.keyStrengths.map((strength, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      {resumeModel.experience.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: "var(--color-text)" }}>
            <span className="mr-2">💼</span>
            Work Experience
          </h3>
          <div className="space-y-4">
            {resumeModel.experience.map((exp) => (
              <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold" style={{ color: "var(--color-text)" }}>
                      {exp.position}
                    </h4>
                    <p className="font-medium" style={{ color: "var(--color-accent-blue)" }}>{exp.company}</p>
                    <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
                      {exp.startDate} - {exp.endDate} • {exp.location}
                    </p>
                  </div>
                  {exp.isRelevant && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Relevant
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="mt-2" style={{ color: "var(--color-text)" }}>{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <div className="mt-2">
                    <label className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>
                      Achievements:
                    </label>
                    <ul className="list-disc list-inside text-sm mt-1" style={{ color: "var(--color-secondary)" }}>
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-2">
                    <label className="text-sm font-medium mb-1 block" style={{ color: "var(--color-secondary)" }}>
                      Technologies:
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: "var(--color-text)" }}>
          <span className="mr-2">🛠️</span>
          Skills
        </h3>
        <div className="space-y-4">
          {resumeModel.skills.technical.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "var(--color-secondary)" }}>
                Technical Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {resumeModel.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      skill.isRelevant
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {skill.name}
                    {skill.proficiency && (
                      <span className="ml-1 text-xs opacity-75">
                        ({skill.proficiency})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resumeModel.skills.soft.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "var(--color-secondary)" }}>
                Soft Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {resumeModel.skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resumeModel.skills.certifications.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: "var(--color-secondary)" }}>
                Certifications
              </label>
              <div className="space-y-2">
                {resumeModel.skills.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span className="font-medium" style={{ color: "var(--color-text)" }}>{cert.name}</span>
                      <span className="text-sm ml-2" style={{ color: "var(--color-secondary)" }}>
                        by {cert.issuer}
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: "var(--color-secondary)" }}>
                      {cert.dateObtained}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      {resumeModel.projects.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: "var(--color-text)" }}>
            <span className="mr-2">🚀</span>
            Projects
          </h3>
          <div className="space-y-4">
            {resumeModel.projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold" style={{ color: "var(--color-text)" }}>
                    {project.name}
                  </h4>
                  {project.relevanceScore && project.relevanceScore > 70 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      High Relevance
                    </span>
                  )}
                </div>
                <p className="mb-2" style={{ color: "var(--color-text)" }}>{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:opacity-80"
                      style={{ color: "var(--color-accent-blue)" }}
                    >
                      View Project →
                    </a>                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDataDisplay;
