# Called to Work

> Helping the saints gain employment through AI-powered resume analysis and job application tracking.

**Called to Work** is a modern web application that helps job seekers optimize their resumes for specific positions using AI-powered analysis and track their job applications with detailed feedback.

## ✨ Features

- **🤖 AI-Powered Resume Analysis** - Get comprehensive feedback on your resume with ATS compatibility scoring
- **📊 Multi-Category Scoring** - Detailed analysis across tone/style, content, structure, and skills
- **📋 Application Tracking** - Keep track of all your job applications and their feedback in one place
- **🎯 Job-Specific Analysis** - Tailor your resume analysis to specific job descriptions and companies
- **📱 Responsive Design** - Works seamlessly across desktop and mobile devices
- **🌙 Dark/Light Theme** - Toggle between themes for comfortable viewing
- **📄 PDF Processing** - Upload PDF resumes with automatic image conversion for analysis
- **🔐 Secure Authentication** - User authentication and data storage via Puter.com

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun package manager
- A [Puter.com](https://puter.com) account for backend services

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/called-to-work.git
cd called-to-work
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking

## 📖 How It Works

1. **Upload Resume** - Upload your PDF resume along with job details (company name, job title, job description)
2. **AI Analysis** - The system analyzes your resume against the specific job requirements using AI
3. **Get Feedback** - Receive detailed scores and actionable suggestions across multiple categories:
   - **ATS Score** - How well your resume performs with Applicant Tracking Systems
   - **Tone & Style** - Professional language and presentation analysis
   - **Content** - Relevance and quality of your experience and achievements
   - **Structure** - Organization and formatting assessment
   - **Skills** - Technical and soft skills alignment with job requirements
4. **Track Applications** - View all your analyzed resumes and track your job application progress

## 🏗️ Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **File Processing**: PDF.js for PDF handling
- **Backend Services**: Puter.com (file storage, AI analysis, authentication)
- **Deployment**: Docker-ready with production builds

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t called-to-work .

# Run the container
docker run -p 3000:3000 called-to-work
```

Deploy to any Docker-compatible platform:
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

## 📁 Project Structure

```
called-to-work/
├── app/
│   ├── components/          # Reusable UI components
│   ├── lib/                # Utilities and hooks
│   ├── routes/             # Application routes
│   └── app.css            # Global styles
├── constants/              # Application constants
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React Router](https://reactrouter.com/)
- Powered by [Puter.com](https://puter.com) for backend services
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- PDF processing via [PDF.js](https://mozilla.github.io/pdf.js/)

---

**Called to Work** - Empowering job seekers with AI-driven insights to land their dream jobs. 🎯