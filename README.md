# ResumeAI — AI-Powered Resume Analyzer

ResumeAI is a full-stack web application that analyzes resumes using AI. Users upload a PDF resume and receive an instant score, identified skills, an experience summary, and personalized improvement suggestions. It also includes a Job Match feature that compares a resume against a job description.

**Live App:** https://main.d10rgg5wzovfno.amplifyapp.com/

---

## Features

- Upload a resume PDF via drag-and-drop or file picker
- Automatic text extraction from PDF using `pdfjs-dist`
- AI-generated resume score (out of 100)
- Extracted list of key skills
- Concise experience summary
- Actionable improvement suggestions
- Job Match: paste a job description and get a match percentage with missing skills

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Axios
- pdfjs-dist (PDF text extraction)

### Backend (AWS Serverless)

- AWS Lambda — handles resume analysis and job matching logic
- AWS API Gateway — exposes Lambda functions as HTTP endpoints
- AWS DynamoDB — stores analysis results
- AWS S3 — file storage
- AWS Amplify — frontend hosting and deployment

### AI

- Groq API (Llama 3.3 70B model) for resume analysis and job matching

---

## Architecture / Data Flow

```
User uploads PDF
   ↓
Frontend extracts text (pdfjs-dist)
   ↓
POST request → API Gateway → Lambda
   ↓
Lambda calls Groq AI with resume text
   ↓
AI returns skills, score, experience summary, improvements (JSON)
   ↓
Lambda returns response → Frontend displays results

```

For Job Match:

```
User pastes job description
   ↓
POST { resumeText, jobDescription } → Lambda
   ↓
AI compares resume vs job description
   ↓
Returns match score + missing skills

```

---

## Project Setup (Run Locally)

### Prerequisites

- Node.js 20+
- npm

### Steps

```bash
# Clone the repository
git clone https://github.com/Divyakhandare17/resume-analyzer.git
cd resume-analyzer

# Install dependencies
npm install

# Run the development server
npm run dev

```

The app will be available at `http://localhost:5173`.

---

## Backend Setup (AWS)

1. Create an S3 bucket for file storage.
2. Create a DynamoDB table (`resume-results`) with `userId` as the partition key.
3. Create a Lambda function (`analyzeResume`) with Node.js 22.x runtime.
4. Add a `GROQ_API_KEY` environment variable to the Lambda (get a free key from [console.groq.com](https://console.groq.com/)).
5. Attach an API Gateway (HTTP API) trigger to the Lambda with CORS enabled.
6. Update the API URL in the frontend's `resumeApi.js`.

---

## Deployment

The frontend is deployed using **AWS Amplify**, connected directly to this GitHub repository. Every push to the `main` branch triggers an automatic build and deployment.

- Build command: `npm run build`
- Output directory: `dist`

---

## Future Improvements

- User authentication and resume history
- Support for DOCX resumes
- Resume formatting/ATS-compatibility checks
- Export analysis as PDF report

