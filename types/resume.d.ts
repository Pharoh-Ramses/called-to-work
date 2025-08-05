// Resume Data Model Types

interface ResumeModel {
  id: string;
  version: number;
  lastModified: Date;
  originalResumeId?: string; // Reference to original uploaded resume

  // Personal Information
  personalInfo: PersonalInfo;

  // Professional Summary
  summary: ProfessionalSummary;

  // Work Experience
  experience: WorkExperience[];

  // Skills (categorized for better ATS parsing)
  skills: SkillsSection;

  // Education
  education: Education[];

  // Projects (important for tech roles)
  projects: Project[];

  // Additional sections
  achievements?: Achievement[];
  volunteer?: VolunteerExperience[];
  publications?: Publication[];

  // Metadata for optimization
  optimization: OptimizationMetadata;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
  website?: string;
}

interface ProfessionalSummary {
  content: string;
  keyStrengths: string[];
  targetRole?: string;
  yearsOfExperience?: number;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | "Present";
  location: string;
  description: string;
  achievements: string[];
  technologies?: string[];
  isRelevant: boolean; // AI flags relevance to target job
  relevanceScore?: number; // 0-100 score
  suggestedImprovements?: string[];
}

interface SkillsSection {
  technical: TechnicalSkill[];
  soft: string[];
  certifications: Certification[];
  languages: Language[];
}

interface TechnicalSkill {
  name: string;
  category: string; // e.g., "Programming", "Frameworks", "Tools"
  proficiency?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience?: number;
  isRelevant: boolean;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
  isRelevant: boolean;
}

interface Language {
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
  isRelevant: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  githubUrl?: string;
  relevanceScore?: number; // AI-generated relevance to target job
  suggestedImprovements?: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "Award" | "Recognition" | "Publication" | "Speaking" | "Other";
  isRelevant: boolean;
}

interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  achievements?: string[];
  isRelevant: boolean;
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  publication: string;
  date: string;
  url?: string;
  isRelevant: boolean;
}

interface OptimizationMetadata {
  targetJobId?: string;
  targetJobTitle?: string;
  targetCompany?: string;
  atsScore?: number;
  lastOptimized?: Date;
  appliedSuggestions: AppliedSuggestion[];
  pendingSuggestions: PendingSuggestion[];
  optimizationHistory: OptimizationSession[];
}

interface AppliedSuggestion {
  id: string;
  type: "content" | "keyword" | "structure" | "formatting";
  section: string; // which section was modified
  originalContent: string;
  optimizedContent: string;
  appliedDate: Date;
  impactScore?: number; // estimated ATS score improvement
}

interface PendingSuggestion {
  id: string;
  type: "content" | "keyword" | "structure" | "formatting";
  section: string;
  suggestion: string;
  reasoning: string;
  priority: "high" | "medium" | "low";
  estimatedImpact?: number;
}

interface OptimizationSession {
  id: string;
  startDate: Date;
  endDate?: Date;
  targetJobId: string;
  initialScore: number;
  finalScore?: number;
  questionsAsked: OptimizationQuestion[];
  changesApplied: string[];
  phases: OptimizationPhase[];
  currentPhase?:
    | "blindSpot"
    | "summary"
    | "achievements"
    | "gaps"
    | "ats"
    | "formatting"
    | "outreach";
}

interface OptimizationPhase {
  phase:
    | "blindSpot"
    | "summary"
    | "achievements"
    | "gaps"
    | "ats"
    | "formatting"
    | "outreach";
  name: string;
  description: string;
  completed: boolean;
  startDate?: Date;
  endDate?: Date;
  improvements: string[];
  scoreImpact: number;
  questions: OptimizationQuestion[];
  aiResponse?: any; // Store the AI response for this phase
}

interface OptimizationQuestion {
  id: string;
  question: string;
  section: string;
  reasoning: string;
  userResponse?: string;
  wasApplied: boolean;
  appliedDate?: Date;
}

// Utility types for AI processing
interface ResumeAnalysisResult {
  feedback: Feedback;
  extractedData: Partial<ResumeModel>;
  confidence: number; // 0-100
  missingFields: string[];
  suggestions: PendingSuggestion[];
  atsScore: number;
}

interface EnhancedAIResponse {
  feedback: Feedback;
  extractedData: {
    personalInfo: Partial<PersonalInfo>;
    summary: Partial<ProfessionalSummary>;
    experience: Partial<WorkExperience>[];
    skills: Partial<SkillsSection>;
    education: Partial<Education>[];
    projects: Partial<Project>[];
  };
}

interface JobMatchAnalysis {
  overallMatch: number; // 0-100
  sectionMatches: {
    experience: number;
    skills: number;
    education: number;
    projects: number;
  };
  missingKeywords: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  recommendedQuestions: OptimizationQuestion[];
}
