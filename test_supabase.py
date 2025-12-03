# test_supabase.py
from supabase_client import supabase

def main():
    result = supabase.table("users").select("*").limit(1).execute()
    print(result)

if __name__ == "__main__":
    main()
