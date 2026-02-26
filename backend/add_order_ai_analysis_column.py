import sqlite3

def add_column():
    print("Migrating orders table...")
    try:
        conn = sqlite3.connect('hessa.lls')
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE orders ADD COLUMN ai_analysis TEXT DEFAULT NULL")
        conn.commit()
        conn.close()
        print("Migration successful: Added ai_analysis column to orders.")
    except Exception as e:
        print(f"Migration failed (maybe column exists?): {e}")

if __name__ == "__main__":
    add_column()
