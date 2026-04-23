import sqlite3
from datetime import datetime

DB_PATH = "resumeiq.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT,
            job_role      TEXT,
            total_score   REAL,
            total_questions INTEGER,
            created_at    TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Database initialized")

def save_session(name, job_role, total_score, total_questions):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO sessions (name, job_role, total_score, total_questions, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, job_role, total_score, total_questions,
          datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    conn.commit()
    conn.close()

def get_all_sessions():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM sessions ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    result = []
    for row in rows:
        result.append({
            "id":               row[0],
            "name":             row[1],
            "job_role":         row[2],
            "total_score":      row[3],
            "total_questions":  row[4],
            "created_at":       row[5]
        })
    return result