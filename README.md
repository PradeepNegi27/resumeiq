# ResumeIQ 🎯
### AI-Powered Interview Preparation Platform

ResumeIQ is a full-stack web app I built to help job seekers practice interviews smarter. It analyzes your resume and job description, then generates personalized interview questions and evaluates your answers using AI.

---

## 🚀 Live Demo

🌐 **App:** [https://resumeiq-client.onrender.com](https://resumeiq-client.onrender.com)  
⚙️ **API:** [https://resumeiq-31bx.onrender.com](https://resumeiq-31bx.onrender.com)

---

## 💡 What It Does

- Upload your resume (PDF) and paste a job description
- Get 10 personalized interview questions based on your actual resume:
  - 3 questions about your **projects**
  - 3 questions about your **skills**
  - 4 **HR questions** based on the job role
- Answer each question and get instant AI feedback with a score
- View your interview history and track your progress over time

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Axios for API calls

**Backend**
- FastAPI (Python)
- Groq API with LLaMA 3.3 70B model
- PyMuPDF for PDF text extraction
- SQLite for session storage

**Deployment**
- Render (both frontend and backend)

---

## 📁 Project Structure

```
resumeiq/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx        # Resume upload & job description
│   │   │   ├── Interview.jsx   # Question & answer interface
│   │   │   ├── Result.jsx      # Score & feedback display
│   │   │   ├── History.jsx     # Past sessions
│   │   │   └── Navbar.jsx
│   │   └── App.jsx
│   └── package.json
│
└── server/                 # FastAPI backend
    ├── main.py             # API routes
    ├── database.py         # SQLite setup
    └── requirements.txt
```

---

## ⚙️ Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- A Groq API key from [console.groq.com](https://console.groq.com)

### Backend Setup

```bash
cd server
pip install -r requirements.txt
```

Create a `.env` file inside the `server/` folder:
```
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:
```bash
python -m uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key |

> Never commit your `.env` file. It's already in `.gitignore`.

---

## 📸 Features Overview

| Feature | Description |
|---------|-------------|
| 📄 Resume Parsing | Extracts text from uploaded PDF resumes |
| 🤖 AI Question Generation | Generates tailored questions using LLaMA 3.3 |
| 📝 Answer Evaluation | Scores answers and gives constructive feedback |
| 📊 Session History | Saves and displays past interview sessions |

---

## 🤝 Contributing

Feel free to fork this repo and submit pull requests. Any improvements are welcome!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with curiosity and a lot of debugging 😄*
