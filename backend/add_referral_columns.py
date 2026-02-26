import sqlite3
import random
import string

def generate_referral_code(prefix="HESSA-"):
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}{random_str}"

def add_columns():
    print("Migrating database for Referral Program...")
    try:
        conn = sqlite3.connect('hessa.lls')
        cursor = conn.cursor()
        
        # Add referral_code column (without UNIQUE constraint first due to SQLite limitation)
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN referral_code TEXT")
            print("Added referral_code column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping referral_code column (might exist): {e}")

        # Add tokens column
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN tokens INTEGER DEFAULT 0")
            print("Added tokens column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping tokens column (might exist): {e}")

        # Generate codes for existing users who don't have one
        cursor.execute("SELECT id, username FROM users WHERE referral_code IS NULL")
        users = cursor.fetchall()
        
        for user_id, username in users:
            code = generate_referral_code()
            # Ensure uniqueness
            while True:
                cursor.execute("SELECT 1 FROM users WHERE referral_code = ?", (code,))
                if not cursor.fetchone():
                    break
                code = generate_referral_code()
            
            cursor.execute("UPDATE users SET referral_code = ?, tokens = 1500 WHERE id = ?", (code, user_id))
            print(f"Generated referral code {code} for user {username}")

        # Create UNIQUE index for referral_code
        try:
            cursor.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code)")
            print("Created unique index for referral_code.")
        except Exception as e:
            print(f"Failed to create index: {e}")

        conn.commit()
        conn.close()
        print("Migration successful!")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    add_columns()
