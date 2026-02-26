import sqlite3

def migrate():
    print("Migrating orders table for Referral Program...")
    try:
        conn = sqlite3.connect('hessa.lls')
        cursor = conn.cursor()
        
        try:
            cursor.execute("ALTER TABLE orders ADD COLUMN referral_code TEXT")
            print("Added referral_code column to orders table.")
        except sqlite3.OperationalError as e:
            print(f"Skipping referral_code column (might exist): {e}")

        conn.commit()
        conn.close()
        print("Migration successful!")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
