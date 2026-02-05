"""Add phone, email, telegram, note columns to employees table if missing."""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "hessa.lls")
if not os.path.exists(DB_PATH):
    DB_PATH = os.path.join(os.path.dirname(__file__), "hessa.db")

COLUMNS = [
    ("phone", "VARCHAR(30)"),
    ("email", "VARCHAR(100)"),
    ("telegram", "VARCHAR(50)"),
    ("note", "VARCHAR(500)"),
]

def migrate():
    print("Migrating employees table...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(employees)")
    existing = {row[1] for row in cursor.fetchall()}
    for col_name, col_type in COLUMNS:
        if col_name in existing:
            print(f"  {col_name} already exists, skip")
            continue
        try:
            cursor.execute(f"ALTER TABLE employees ADD COLUMN {col_name} {col_type}")
            conn.commit()
            print(f"  Added {col_name}")
        except Exception as e:
            print(f"  Failed to add {col_name}: {e}")
    conn.close()
    print("Done.")

if __name__ == "__main__":
    migrate()
