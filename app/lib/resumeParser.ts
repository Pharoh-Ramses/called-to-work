import { generateUUID } from "~/lib/utils";

export class ResumeParser {
  /**
   * Creates an empty resume model with default structure
   */
  static createEmptyResumeModel(originalResumeId?: string): ResumeModel {
    return {
      id: generateUUID(),
      version: 1,
      lastModified: new Date(),
      originalResumeId,
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
      },
      summary: {
        content: "",
        keyStrengths: [],
      },
      experience: [],
      skills: {
        technical: [],
        soft: [],
        certifications: [],
        languages: [],
      },
      education: [],
      projects: [],
      optimization: {
        appliedSuggestions: [],
        pendingSuggestions: [],
        optimizationHistory: [],
      },
    };
  }

  /**
   * Parses enhanced AI response to extract structured resume data
   */
  static parseEnhancedAIResponse(
    aiResponse: string,
    originalResumeId: string,
    jobData: { companyName: string; jobTitle: string; jobDescription: string },
  ): ResumeModel {
    const resumeModel = this.createEmptyResumeModel(originalResumeId);

    // Set optimization metadata
    resumeModel.optimization.targetJobId = originalResumeId;
    resumeModel.optimization.targetJobTitle = jobData.jobTitle;
    resumeModel.optimization.targetCompany = jobData.companyName;

    try {
      const parsed = JSON.parse(aiResponse) as EnhancedAIResponse;

      // Set ATS score from feedback
      resumeModel.optimization.atsScore = parsed.feedback.ATS?.score || 0;

      // Extract suggestions from feedback
      this.extractSuggestionsFromFeedback(parsed.feedback, resumeModel);

      // Populate resume data from extracted data
      this.populateResumeFromExtractedData(resumeModel, parsed.extractedData);

      // Initialize optimization phases
      resumeModel.optimization.optimizationHistory = [
        this.createInitialOptimizationSession(
          originalResumeId,
          parsed.feedback.overallScore,
        ),
      ];
    } catch (error) {
      console.error("Failed to parse enhanced AI response:", error);
    }

    return resumeModel;
  }

  /**
   * Legacy method for backward compatibility
   */
  static parseAIFeedbackToResumeModel(
    feedback: string | Feedback,
    originalResumeId: string,
    jobData: { companyName: string; jobTitle: string; jobDescription: string },
  ): ResumeModel {
    const resumeModel = this.createEmptyResumeModel(originalResumeId);

    // Set optimization metadata
    resumeModel.optimization.targetJobId = originalResumeId;
    resumeModel.optimization.targetJobTitle = jobData.jobTitle;
    resumeModel.optimization.targetCompany = jobData.companyName;

    if (typeof feedback === "string") {
      try {
        const parsedFeedback = JSON.parse(feedback) as Feedback;
        resumeModel.optimization.atsScore = parsedFeedback.ATS?.score || 0;

        // Extract suggestions from feedback
        this.extractSuggestionsFromFeedback(parsedFeedback, resumeModel);
      } catch (error) {
        console.error("Failed to parse feedback:", error);
      }
    } else {
      resumeModel.optimization.atsScore = feedback.ATS?.score || 0;
      this.extractSuggestionsFromFeedback(feedback, resumeModel);
    }

    return resumeModel;
  }

  /**
   * Populates resume model from extracted AI data
   */
  private static populateResumeFromExtractedData(
    resumeModel: ResumeModel,
    extractedData: EnhancedAIResponse["extractedData"],
  ): void {
    // Populate personal info
    if (extractedData.personalInfo) {
      resumeModel.personalInfo = {
        ...resumeModel.personalInfo,
        ...extractedData.personalInfo,
      };
    }

    // Populate summary
    if (extractedData.summary) {
      resumeModel.summary = {
        ...resumeModel.summary,
        ...extractedData.summary,
      };
    }

    // Populate experience
    if (extractedData.experience) {
      resumeModel.experience = extractedData.experience.map((exp) => ({
        id: generateUUID(),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        location: exp.location || "",
        description: exp.description || "",
        achievements: exp.achievements || [],
        technologies: exp.technologies || [],
        isRelevant: true,
      }));
    }

    // Populate skills
    if (extractedData.skills) {
      if (extractedData.skills.technical) {
        resumeModel.skills.technical = extractedData.skills.technical.map(
          (skill) => ({
            name: skill.name || "",
            category: skill.category || "General",
            proficiency: skill.proficiency,
            isRelevant: true,
          }),
        );
      }
      if (extractedData.skills.soft) {
        resumeModel.skills.soft = extractedData.skills.soft;
      }
      if (extractedData.skills.certifications) {
        resumeModel.skills.certifications =
          extractedData.skills.certifications.map((cert) => ({
            name: cert.name || "",
            issuer: cert.issuer || "",
            dateObtained: cert.dateObtained || "",
            isRelevant: true,
          }));
      }
      if (extractedData.skills.languages) {
        resumeModel.skills.languages = extractedData.skills.languages.map(
          (lang) => ({
            name: lang.name || "",
            proficiency: lang.proficiency || "Basic",
          }),
        );
      }
    }

    // Populate education
    if (extractedData.education) {
      resumeModel.education = extractedData.education.map((edu) => ({
        id: generateUUID(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: edu.gpa,
        honors: edu.honors || [],
        isRelevant: true,
      }));
    }

    // Populate projects
    if (extractedData.projects) {
      resumeModel.projects = extractedData.projects.map((proj) => ({
        id: generateUUID(),
        name: proj.name || "",
        description: proj.description || "",
        technologies: proj.technologies || [],
        achievements: proj.achievements || [],
        url: proj.url,
        relevanceScore: 80, // Default relevance
      }));
    }
  }

  /**
   * Creates initial optimization session with phases
   */
  private static createInitialOptimizationSession(
    targetJobId: string,
    initialScore: number,
  ): OptimizationSession {
    return {
      id: generateUUID(),
      startDate: new Date(),
      targetJobId,
      initialScore,
      questionsAsked: [],
      changesApplied: [],
      phases: this.createOptimizationPhases(),
      currentPhase: "blindSpot",
    };
  }

  /**
   * Creates all optimization phases
   */
  private static createOptimizationPhases(): OptimizationPhase[] {
    return [
      {
        phase: "blindSpot",
        name: "Blind Spot Analysis",
        description: "Identify what recruiters look for but might be missing",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
      {
        phase: "summary",
        name: "Summary Optimization",
        description: "Craft a compelling, job-tailored summary",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
      {
        phase: "achievements",
        name: "Achievement Focus",
        description: "Transform responsibilities into measurable achievements",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
      {
        phase: "gaps",
        name: "Gap Reframing",
        description: "Turn weaknesses into growth opportunities",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
      {
        phase: "ats",
        name: "ATS Optimization",
        description: "Add relevant keywords naturally",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
      {
        phase: "formatting",
        name: "Format & Structure",
        description: "Ensure clean, scannable formatting",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
      {
        phase: "outreach",
        name: "Outreach Message",
        description: "Create compelling hiring manager outreach",
        completed: false,
        improvements: [],
        scoreImpact: 0,
        questions: [],
      },
    ];
  }

  /**
   * Extracts suggestions from feedback and adds them to the resume model
   */
  private static extractSuggestionsFromFeedback(
    feedback: Feedback,
    resumeModel: ResumeModel,
  ): void {
    const sections = [
      "ATS",
      "toneAndStyle",
      "content",
      "structure",
      "skills",
    ] as const;

    sections.forEach((section) => {
      const sectionData = feedback[section];
      if (sectionData?.tips) {
        sectionData.tips.forEach((tip) => {
          if (tip.type === "improve") {
            const suggestion: PendingSuggestion = {
              id: generateUUID(),
              type: this.mapSectionToSuggestionType(section),
              section: section,
              suggestion: tip.tip,
              reasoning: ("explanation" in tip
                ? tip.explanation
                : tip.tip) as string,
              priority: this.determinePriority(sectionData.score),
              estimatedImpact: this.estimateImpact(sectionData.score),
            };
            resumeModel.optimization.pendingSuggestions.push(suggestion);
          }
        });
      }
    });
  }

  /**
   * Maps feedback section to suggestion type
   */
  private static mapSectionToSuggestionType(
    section: string,
  ): "content" | "keyword" | "structure" | "formatting" {
    switch (section) {
      case "ATS":
      case "skills":
        return "keyword";
      case "structure":
        return "structure";
      case "toneAndStyle":
        return "formatting";
      default:
        return "content";
    }
  }

  /**
   * Determines suggestion priority based on section score
   */
  private static determinePriority(score: number): "high" | "medium" | "low" {
    if (score < 60) return "high";
    if (score < 80) return "medium";
    return "low";
  }

  /**
   * Estimates impact based on current score
   */
  private static estimateImpact(score: number): number {
    return Math.max(0, 100 - score);
  }

  /**
   * Generates optimization questions based on pending suggestions
   */
  static generateOptimizationQuestions(
    resumeModel: ResumeModel,
    jobDescription: string,
  ): OptimizationQuestion[] {
    const questions: OptimizationQuestion[] = [];

    // Generate questions based on pending suggestions
    resumeModel.optimization.pendingSuggestions.forEach((suggestion) => {
      const question = this.createQuestionFromSuggestion(
        suggestion,
        jobDescription,
      );
      if (question) {
        questions.push(question);
      }
    });

    // Add general questions for empty sections
    if (resumeModel.experience.length === 0) {
      questions.push({
        id: generateUUID(),
        question:
          "Can you tell me about your work experience, including company names, positions, and key achievements?",
        section: "experience",
        reasoning:
          "Work experience is crucial for ATS scoring and job matching",
        wasApplied: false,
      });
    }

    if (resumeModel.skills.technical.length === 0) {
      questions.push({
        id: generateUUID(),
        question: `What technical skills do you have that are relevant to ${resumeModel.optimization.targetJobTitle}?`,
        section: "skills",
        reasoning:
          "Technical skills matching is important for ATS optimization",
        wasApplied: false,
      });
    }

    return questions.slice(0, 5); // Limit to 5 questions per session
  }

  /**
   * Creates a question from a suggestion
   */
  private static createQuestionFromSuggestion(
    suggestion: PendingSuggestion,
    _jobDescription: string,
  ): OptimizationQuestion | null {
    const questionTemplates = {
      keyword: `I noticed your resume could benefit from more relevant keywords. ${suggestion.suggestion} Can you provide specific examples or details about your experience with these areas?`,
      content: `To improve your resume content: ${suggestion.suggestion} Can you share more details about your achievements and responsibilities?`,
      structure: `For better resume structure: ${suggestion.suggestion} Would you like help reorganizing this information?`,
      formatting: `To enhance your resume's tone and style: ${suggestion.suggestion} Can you provide the content you'd like to improve?`,
    };

    const template = questionTemplates[suggestion.type];
    if (!template) return null;

    return {
      id: generateUUID(),
      question: template,
      section: suggestion.section,
      reasoning: suggestion.reasoning,
      wasApplied: false,
    };
  }

  /**
   * Converts resume model back to legacy format for compatibility
   */
  static toLegacyResumeData(resumeModel: ResumeModel): ResumeData {
    return {
      id: resumeModel.id,
      resumePath: "", // Would need to be provided separately
      imagePath: "", // Would need to be provided separately
      companyName: resumeModel.optimization.targetCompany || "",
      jobTitle: resumeModel.optimization.targetJobTitle || "",
      jobDescription: "", // Would need to be provided separately
      feedback: "", // Would need to be converted from suggestions
    };
  }
}
