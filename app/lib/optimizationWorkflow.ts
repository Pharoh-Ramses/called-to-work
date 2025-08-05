import { prepareOptimizationInstructions } from "constants/index";
import { generateUUID } from "~/lib/utils";

export class OptimizationWorkflow {
  /**
   * Starts a new optimization session for a resume
   */
  static async startOptimizationSession(
    resumeModel: ResumeModel,
    _jobData: {
      companyName: string;
      jobTitle: string;
      jobDescription: string;
      industry: string;
    },
  ): Promise<OptimizationSession> {
    const session: OptimizationSession = {
      id: generateUUID(),
      startDate: new Date(),
      targetJobId: resumeModel.optimization.targetJobId || resumeModel.id,
      initialScore: resumeModel.optimization.atsScore || 0,
      questionsAsked: [],
      changesApplied: [],
      phases: this.createOptimizationPhases(),
      currentPhase: "blindSpot",
    };

    // Add session to resume model
    resumeModel.optimization.optimizationHistory.push(session);

    return session;
  }

  /**
   * Processes a specific optimization phase
   */
  static async processOptimizationPhase(
    phase: OptimizationPhase["phase"],
    resumeModel: ResumeModel,
    jobData: {
      companyName: string;
      jobTitle: string;
      jobDescription: string;
      industry: string;
    },
    aiChat: (prompt: string) => Promise<any>,
  ): Promise<{
    questions: OptimizationQuestion[];
    suggestions: string[];
    aiResponse: any;
  }> {
    const instructions = prepareOptimizationInstructions({
      phase,
      jobTitle: jobData.jobTitle,
      jobDescription: jobData.jobDescription,
      industry: jobData.industry,
      company: jobData.companyName,
      resumeSection: this.getRelevantResumeSection(resumeModel, phase),
    });

    try {
      const aiResponse = await aiChat(instructions);
      const parsedResponse = this.parsePhaseResponse(phase, aiResponse);

      return {
        questions: parsedResponse.questions || [],
        suggestions: parsedResponse.suggestions || [],
        aiResponse: parsedResponse,
      };
    } catch (error) {
      console.error(`Failed to process ${phase} phase:`, error);
      return {
        questions: [],
        suggestions: [],
        aiResponse: null,
      };
    }
  }

  /**
   * Gets the relevant resume section for a specific phase
   */
  private static getRelevantResumeSection(
    resumeModel: ResumeModel,
    phase: OptimizationPhase["phase"],
  ): string {
    switch (phase) {
      case "summary":
        return resumeModel.summary.content;
      case "achievements":
        return resumeModel.experience
          .map((exp) => `${exp.company} - ${exp.position}: ${exp.description}`)
          .join("\n\n");
      case "ats":
        return JSON.stringify({
          skills: resumeModel.skills,
          experience: resumeModel.experience.map((exp) => ({
            company: exp.company,
            position: exp.position,
            technologies: exp.technologies,
          })),
        });
      default:
        return JSON.stringify(resumeModel, null, 2);
    }
  }

  /**
   * Parses AI response for different phases
   */
  private static parsePhaseResponse(
    phase: OptimizationPhase["phase"],
    aiResponse: any,
  ): any {
    try {
      const content =
        typeof aiResponse === "string"
          ? aiResponse
          : aiResponse.message?.content || aiResponse.content || "";

      if (typeof content === "string") {
        return JSON.parse(content);
      }

      return content;
    } catch (error) {
      console.error(`Failed to parse ${phase} response:`, error);
      return { questions: [], suggestions: [] };
    }
  }

  /**
   * Applies user response to a specific question
   */
  static applyUserResponseToPhase(
    resumeModel: ResumeModel,
    sessionId: string,
    questionId: string,
    userResponse: string,
    phase: OptimizationPhase["phase"],
  ): ResumeModel {
    const session = resumeModel.optimization.optimizationHistory.find(
      (s) => s.id === sessionId,
    );
    if (!session) return resumeModel;

    const phaseData = session.phases.find((p) => p.phase === phase);
    if (!phaseData) return resumeModel;

    const question = phaseData.questions.find((q) => q.id === questionId);
    if (!question) return resumeModel;

    // Mark question as applied
    question.userResponse = userResponse;
    question.wasApplied = true;
    question.appliedDate = new Date();

    // Apply the response to the resume model
    this.updateResumeFromResponse(resumeModel, phase, userResponse, question);

    // Track the change
    session.changesApplied.push(
      `${phase}: ${question.question} -> ${userResponse}`,
    );

    return resumeModel;
  }

  /**
   * Updates resume model based on user response
   */
  private static updateResumeFromResponse(
    resumeModel: ResumeModel,
    phase: OptimizationPhase["phase"],
    response: string,
    question: OptimizationQuestion,
  ): void {
    switch (phase) {
      case "summary":
        if (question.section === "summary") {
          resumeModel.summary.content = response;
        }
        break;

      case "achievements":
        // Parse achievements and update experience
        if (question.section === "experience") {
          // This would need more sophisticated parsing
          // For now, just add to the first experience entry
          if (resumeModel.experience.length > 0) {
            resumeModel.experience[0].achievements.push(response);
          }
        }
        break;

      case "ats":
        // Parse skills from response
        if (question.section === "skills") {
          const skills = response.split(",").map((s) => s.trim());
          skills.forEach((skill) => {
            if (!resumeModel.skills.technical.find((ts) => ts.name === skill)) {
              resumeModel.skills.technical.push({
                name: skill,
                category: "General",
                isRelevant: true,
              });
            }
          });
        }
        break;

      case "blindSpot":
        // Add missing information based on the blind spot identified
        this.fillBlindSpot(resumeModel, response, question);
        break;

      default:
        break;
    }
  }

  /**
   * Fills identified blind spots in the resume
   */
  private static fillBlindSpot(
    resumeModel: ResumeModel,
    response: string,
    question: OptimizationQuestion,
  ): void {
    switch (question.section) {
      case "experience":
        // Add new experience entry
        resumeModel.experience.push({
          id: generateUUID(),
          company: "To be specified",
          position: "To be specified",
          startDate: "",
          endDate: "",
          location: "",
          description: response,
          achievements: [],
          isRelevant: true,
        });
        break;

      case "skills":
        // Add missing skills
        const skills = response.split(",").map((s) => s.trim());
        skills.forEach((skill) => {
          resumeModel.skills.technical.push({
            name: skill,
            category: "Missing Skill",
            isRelevant: true,
          });
        });
        break;

      case "education":
        // Add missing education
        resumeModel.education.push({
          id: generateUUID(),
          institution: "To be specified",
          degree: "To be specified",
          field: response,
          startDate: "",
          endDate: "",
          isRelevant: true,
        });
        break;

      default:
        break;
    }
  }

  /**
   * Completes a phase and moves to the next one
   */
  static completePhase(
    resumeModel: ResumeModel,
    sessionId: string,
    phase: OptimizationPhase["phase"],
    scoreImprovement: number = 0,
  ): ResumeModel {
    const session = resumeModel.optimization.optimizationHistory.find(
      (s) => s.id === sessionId,
    );
    if (!session) return resumeModel;

    const phaseData = session.phases.find((p) => p.phase === phase);
    if (!phaseData) return resumeModel;

    // Mark phase as completed
    phaseData.completed = true;
    phaseData.endDate = new Date();
    phaseData.scoreImpact = scoreImprovement;

    // Move to next phase
    const currentIndex = session.phases.findIndex((p) => p.phase === phase);
    if (currentIndex < session.phases.length - 1) {
      session.currentPhase = session.phases[currentIndex + 1].phase;
    } else {
      // All phases completed
      session.endDate = new Date();
      session.finalScore =
        (resumeModel.optimization.atsScore || 0) + scoreImprovement;
    }

    return resumeModel;
  }

  /**
   * Gets the current phase for a session
   */
  static getCurrentPhase(
    resumeModel: ResumeModel,
    sessionId: string,
  ): OptimizationPhase | null {
    const session = resumeModel.optimization.optimizationHistory.find(
      (s) => s.id === sessionId,
    );
    if (!session || !session.currentPhase) return null;

    return session.phases.find((p) => p.phase === session.currentPhase) || null;
  }

  /**
   * Gets optimization progress for a session
   */
  static getOptimizationProgress(
    resumeModel: ResumeModel,
    sessionId: string,
  ): {
    completedPhases: number;
    totalPhases: number;
    currentPhase: string | null;
    scoreImprovement: number;
  } {
    const session = resumeModel.optimization.optimizationHistory.find(
      (s) => s.id === sessionId,
    );
    if (!session) {
      return {
        completedPhases: 0,
        totalPhases: 0,
        currentPhase: null,
        scoreImprovement: 0,
      };
    }

    const completedPhases = session.phases.filter((p) => p.completed).length;
    const scoreImprovement = session.phases.reduce(
      (sum, p) => sum + p.scoreImpact,
      0,
    );

    return {
      completedPhases,
      totalPhases: session.phases.length,
      currentPhase: session.currentPhase || null,
      scoreImprovement,
    };
  }

  /**
   * Creates default optimization phases
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
}
