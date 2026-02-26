import sqlite3

def add_column():
    print("Migrating database...")
    try:
        conn = sqlite3.connect('hessa.lls')
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE users ADD COLUMN full_name TEXT DEFAULT NULL")
        conn.commit()
        conn.close()
        print("Migration successful: Added full_name column.")
    except Exception as e:
        print(f"Migration failed (maybe column exists?): {e}")

if __name__ == "__main__":
    add_column()
