import sqlite3

def add_column():
    print("Migrating database...")
    try:
        conn = sqlite3.connect('hessa.db') # Check database name!
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE employees ADD COLUMN payment_day INTEGER DEFAULT 15")
        conn.commit()
        conn.close()
        print("Migration successful: Added payment_day column.")
    except Exception as e:
        print(f"Migration failed (maybe column exists?): {e}")

if __name__ == "__main__":
    add_column()
