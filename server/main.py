from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import pymupdf
import os
import json
import sqlite3
from database import init_db, save_session, get_all_sessions
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

client = Groq(api_key=REMOVED" ")

def extract_pdf_text(file_bytes: bytes) -> str:
    doc = pymupdf.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()

def generate_questions(resume_text: str, job_description: str) -> list:
    prompt = f"""
You are an expert interviewer. Based on the resume and job description below,
generate exactly 10 interview questions.

Mix these types:
- 3 questions about their PROJECTS mentioned in resume
- 3 questions about their SKILLS mentioned in resume
- 4 HR questions based on the job description

Resume:
{resume_text[:2000]}

Job Description:
{job_description[:1000]}

Return ONLY a JSON array of 10 questions like this:
[
  {{"id": 1, "question": "...", "type": "project"}},
  {{"id": 2, "question": "...", "type": "skill"}},
  {{"id": 3, "question": "...", "type": "hr"}}
]
Return only the JSON, no other text.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    content = response.choices[0].message.content.strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()

    questions = json.loads(content)
    return questions

def evaluate_answer(question: str, answer: str) -> dict:
    prompt = f"""
You are an expert interviewer evaluating a candidate's answer.

Question: {question}
Candidate's Answer: {answer}

Evaluate the answer and return ONLY a JSON object like this:
{{
  "score": <number from 1-10>,
  "feedback": "<2-3 sentences of constructive feedback>",
  "strength": "<one thing they did well>",
  "improvement": "<one thing to improve>"
}}
Return only the JSON, no other text.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
    )

    content = response.choices[0].message.content.strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()

    result = json.loads(content)
    return result

@app.get("/")
def home():
    return {"message": "ResumeIQ API is running!"}

@app.post("/api/upload")
async def upload_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        file_bytes = await resume.read()
        resume_text = extract_pdf_text(file_bytes)
        questions = generate_questions(resume_text, job_description)
        return {
            "success": True,
            "resume_text": resume_text[:500],
            "questions": questions
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/evaluate")
async def evaluate(
    question: str = Form(...),
    answer: str = Form(...),
    candidate_name: str = Form(...)
):
    try:
        result = evaluate_answer(question, answer)
        return {"success": True, "evaluation": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/save-session")
async def save_interview_session(data: dict):
    try:
        save_session(
            name=data["name"],
            job_role=data["job_role"],
            total_score=data["total_score"],
            total_questions=data["total_questions"]
        )
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/sessions")
def get_sessions():
    sessions = get_all_sessions()
    return {"success": True, "sessions": sessions}

@app.delete("/api/sessions")
def clear_sessions():
    conn = sqlite3.connect("resumeiq.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions")
    conn.commit()
    conn.close()
    return {"success": True}
# Serve React frontend
static_path = os.path.join(os.path.dirname(__file__), "../client/dist")
if os.path.exists(static_path):
    app.mount("/assets", StaticFiles(directory=f"{static_path}/assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_react(full_path: str):
        return FileResponse(f"{static_path}/index.html")