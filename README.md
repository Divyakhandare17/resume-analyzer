# ResumeAI — AI-Powered Resume Analyzer

ResumeAI is a full-stack web application that analyzes resumes using AI. Users upload a PDF resume and receive an instant score, identified skills, an experience summary, and personalized improvement suggestions. It also includes a Job Match feature that compares a resume against a job description, an AI-generated cover letter tailored to that job, an Analysis History page backed by DynamoDB, and the ability to download results as a PDF report.

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
- AI Cover Letter Generator: generates a tailored cover letter based on your resume and the job description, with copy and download options
- Analysis History: view past resume analyses with scores and skills, stored in DynamoDB
- Download a full analysis report as a PDF

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- React Router
- Axios
- pdfjs-dist (PDF text extraction)
- jsPDF (PDF report generation)

### Backend (AWS Serverless)

- AWS Lambda — handles resume analysis, job matching, cover letter generation, and history retrieval
- AWS API Gateway — exposes Lambda functions as HTTP endpoints
- AWS DynamoDB — stores past analysis results for the History feature
- AWS S3 — file storage
- AWS Amplify — frontend hosting and deployment

### AI

- Groq API (Llama 3.3 70B model) for resume analysis, job matching, and cover letter generation

---

## Architecture / Data Flow

```
User uploads PDF
   ↓
Frontend extracts text (pdfjs-dist)
   ↓
POST request → API Gateway → Lambda (analyzeResume)
   ↓
Lambda calls Groq AI with resume text
   ↓
AI returns skills, score, experience summary, improvements (JSON)
   ↓
Lambda saves result to DynamoDB
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

For Cover Letter Generation:

```
User clicks "Generate Cover Letter" on Job Match results
   ↓
POST { resumeText, jobDescription } → API Gateway → Lambda (generateCoverLetter)
   ↓
Lambda calls Groq AI to write a tailored cover letter
   ↓
Returns cover letter text → Frontend displays it with copy/download options
```

For History:

```
Frontend requests history with userId (stored in localStorage)
   ↓
GET request → API Gateway → Lambda (getHistory)
   ↓
Lambda queries DynamoDB for that userId
   ↓
Returns list of past analyses → Frontend displays as cards
```

For PDF Download:

```
User clicks "Download Report as PDF" on Results page
   ↓
jsPDF generates a formatted PDF (score, skills, experience, improvements)
   ↓
Browser downloads resume-report.pdf
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
   - Attach the **AmazonDynamoDBFullAccess** policy to its execution role so it can save results.
   - Add a `GROQ_API_KEY` environment variable (get a free key from [console.groq.com](https://console.groq.com/)).
   - Attach an API Gateway (HTTP API) trigger with CORS enabled.
4. Create a second Lambda function (`getHistory`) with Node.js 22.x runtime.
   - Attach the **AmazonDynamoDBFullAccess** policy to its execution role.
   - Attach an API Gateway (HTTP API) trigger with CORS enabled.
5. Create a third Lambda function (`generateCoverLetter`) with Node.js 22.x runtime.
   - Add the same `GROQ_API_KEY` environment variable.
   - Set the function timeout to 30 seconds (Groq response time can vary).
   - Attach an API Gateway (HTTP API) trigger with CORS enabled.
6. Update the API URLs in the frontend (`resumeApi.js`, History page, and Job Match page) to match your deployed endpoints.

---

## Deployment

The frontend is deployed using **AWS Amplify**, connected directly to this GitHub repository. Every push to the `main` branch triggers an automatic build and deployment.

- Build command: `npm run build`
- Output directory: `dist`

---

## Future Improvements

- User authentication (replace localStorage-based user IDs)
- Support for DOCX resumes
- Resume formatting/ATS-compatibility checks
- Keyword highlighting in Job Match results
- Resume comparison (side-by-side)