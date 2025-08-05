export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

// Optimization prompts based on proven strategies
export const optimizationPrompts = {
  blindSpotAnalysis: (industry: string) =>
    `Act like a recruiter in ${industry}. What's missing from this résumé that would stop you from reaching out?`,

  summaryRewrite: (jobDescription: string) =>
    `Rewrite my résumé summary to feel confident, clear, and tailored to this job: ${jobDescription}`,

  achievementFocus: () =>
    `Turn these bullet points into achievement-focused statements — add metrics wherever possible.`,

  gapReframing: () =>
    `Help me reframe career gaps or weaknesses as growth, not failure.`,

  atsOptimization: (jobPost: string) =>
    `Add ATS keywords from this job post — without sounding robotic: ${jobPost}`,

  formatting: () =>
    `Format this résumé so it's easy to scan, clean to read, and works on any system.`,

  outreachMessage: (company: string, role: string) =>
    `Write a short, punchy message I can DM a hiring manager at ${company} for ${role} — no desperation, just value.`,
};

// Enhanced response format that includes extracted data
export const EnhancedAIResponseFormat = `
{
  "feedback": ${AIResponseFormat.trim()},
  "extractedData": {
    "personalInfo": {
      "fullName": "string",
      "email": "string", 
      "phone": "string",
      "location": "string",
      "linkedIn": "string (optional)",
      "portfolio": "string (optional)",
      "github": "string (optional)"
    },
    "summary": {
      "content": "string",
      "keyStrengths": ["string array"],
      "yearsOfExperience": "number (optional)"
    },
    "experience": [
      {
        "company": "string",
        "position": "string", 
        "startDate": "string",
        "endDate": "string or 'Present'",
        "location": "string",
        "description": "string",
        "achievements": ["string array"],
        "technologies": ["string array (optional)"]
      }
    ],
    "skills": {
      "technical": [
        {
          "name": "string",
          "category": "string",
          "proficiency": "Beginner|Intermediate|Advanced|Expert (optional)"
        }
      ],
      "soft": ["string array"],
      "certifications": [
        {
          "name": "string",
          "issuer": "string",
          "dateObtained": "string"
        }
      ],
      "languages": [
        {
          "name": "string", 
          "proficiency": "Basic|Conversational|Fluent|Native"
        }
      ]
    },
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "field": "string", 
        "startDate": "string",
        "endDate": "string",
        "gpa": "string (optional)",
        "honors": ["string array (optional)"]
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "technologies": ["string array"],
        "achievements": ["string array"],
        "url": "string (optional)"
      }
    ]
  }
}`;

// Simple format that focuses on getting reliable feedback
export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;

// Enhanced format for future use when AI is more reliable
export const prepareEnhancedInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.

TASK 1: Analyze and rate this resume for the target job
TASK 2: Extract all structured data from the resume

Be thorough and detailed. Don't be afraid to point out mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This helps users improve.

Target Job: ${jobTitle}
Job Description: ${jobDescription}

Return a JSON object with both feedback and extracted data using this exact format:
${EnhancedAIResponseFormat}

Return ONLY the JSON object, without any other text, comments, or backticks.`;

export const prepareOptimizationInstructions = ({
  phase,
  jobTitle,
  jobDescription,
  industry,
  company,
  resumeSection,
}: {
  phase:
    | "blindSpot"
    | "summary"
    | "achievements"
    | "gaps"
    | "ats"
    | "formatting"
    | "outreach";
  jobTitle: string;
  jobDescription: string;
  industry: string;
  company: string;
  resumeSection?: string;
}) => {
  const baseContext = `Job: ${jobTitle} at ${company}\nIndustry: ${industry}\nJob Description: ${jobDescription}`;

  switch (phase) {
    case "blindSpot":
      return `${optimizationPrompts.blindSpotAnalysis(industry)}
      
${baseContext}

Analyze the resume and identify specific missing elements that would prevent a recruiter from reaching out. Return a JSON object:
{
  "blindSpots": ["specific missing element 1", "specific missing element 2"],
  "questions": [
    {
      "question": "targeted question to fill gap",
      "reasoning": "why this matters to recruiters",
      "section": "which resume section this affects"
    }
  ],
  "priority": "high|medium|low"
}`;

    case "summary":
      return `${optimizationPrompts.summaryRewrite(jobDescription)}
      
Current summary: ${resumeSection || "Not provided"}
${baseContext}

Rewrite the summary to be confident, clear, and tailored. Return JSON:
{
  "optimizedSummary": "rewritten summary",
  "improvements": ["what was improved"],
  "questions": [
    {
      "question": "question to gather missing info",
      "reasoning": "why this strengthens the summary"
    }
  ]
}`;

    case "achievements":
      return `${optimizationPrompts.achievementFocus()}
      
Current experience section: ${resumeSection || "Not provided"}
${baseContext}

Transform responsibilities into achievement-focused statements with metrics. Return JSON:
{
  "optimizedBullets": [
    {
      "original": "original bullet point",
      "optimized": "achievement-focused version",
      "metricsNeeded": "what metrics to ask for"
    }
  ],
  "questions": [
    {
      "question": "question to get specific metrics/results",
      "bulletPoint": "which bullet point this relates to"
    }
  ]
}`;

    case "gaps":
      return `${optimizationPrompts.gapReframing()}
      
${baseContext}

Help reframe any career gaps or weaknesses as growth opportunities. Return JSON:
{
  "identifiedGaps": ["gap or weakness identified"],
  "reframingStrategies": [
    {
      "gap": "the gap/weakness",
      "reframe": "how to position it positively",
      "questions": ["questions to gather positive details"]
    }
  ]
}`;

    case "ats":
      return `${optimizationPrompts.atsOptimization(jobDescription)}
      
${baseContext}

Add relevant ATS keywords naturally. Return JSON:
{
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    {
      "keyword": "keyword to add",
      "section": "where to add it",
      "naturalIntegration": "how to add it naturally"
    }
  ],
  "questions": [
    {
      "question": "question to confirm experience with keyword",
      "keyword": "the keyword"
    }
  ]
}`;

    case "formatting":
      return `${optimizationPrompts.formatting()}
      
Analyze resume structure and formatting for ATS compatibility and readability. Return JSON:
{
  "formattingIssues": ["issue1", "issue2"],
  "recommendations": [
    {
      "issue": "formatting problem",
      "solution": "how to fix it",
      "impact": "why this matters"
    }
  ]
}`;

    case "outreach":
      return `${optimizationPrompts.outreachMessage(company, jobTitle)}
      
${baseContext}

Create a compelling outreach message. Return JSON:
{
  "outreachMessage": "the message",
  "keyPoints": ["what makes this message effective"],
  "personalizationTips": ["how to customize further"]
}`;

    default:
      return prepareInstructions({ jobTitle, jobDescription });
  }
};
