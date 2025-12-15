# apps/api/app/dependencies/auth_middleware.py
from fastapi import Header, HTTPException, status
from supabase import create_client, Client
import os
import jwt

async def verify_jwt(authorization: str = Header(...)):
    """
    FastAPI dependency to verify a Supabase JWT from the Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or malformed",
        )

    token = authorization.split(" ")[1]

    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_anon_key = os.environ.get("SUPABASE_ANON_KEY") # Typically, anon key is used for client-side, service role key for backend admin.
                                                           # However, for JWT verification, we need the public key or the JWT secret.
                                                           # Supabase-py's create_client method typically handles token verification when a session is set.
                                                           # For standalone JWT verification, you might parse the public key.

    # Option 1: Using the Supabase client (if it has a direct JWT verification method)
    # The `supabase` client (create_client) does not expose a public JWT verification method directly
    # that uses the JWT secret without a full session object.
    # We will manually decode and verify using pyjwt and Supabase's public key or secret.

    # Option 2: Manually decode and verify the JWT using pyjwt
    # The JWT secret is usually derived from SUPABASE_SERVICE_ROLE_KEY or directly from the project settings.
    # For a JWT issued by Supabase, the public key is also available.
    # Let's assume the JWT secret is available as an environment variable (SUPABASE_JWT_SECRET)
    # This might need to be retrieved dynamically or configured carefully.
    jwt_secret = os.environ.get("SUPABASE_JWT_SECRET") # This often needs to be explicitly set or derived.

    if not jwt_secret:
        # Fallback/Error if JWT_SECRET is not explicitly provided.
        # In a real Supabase setup, the public key for verifying JWTs is typically fetched or hardcoded.
        # For this example, we'll try to derive a secret or expect it.
        # This is a critical point: how to get the JWT secret for verification reliably.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET is not configured for backend JWT verification.",
        )

    try:
        # Decode and verify the JWT
        # audience (aud) and issuer (iss) claims should also be verified against Supabase's values.
        decoded_payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"], # Supabase typically uses HS256
            audience="authenticated", # Default audience for Supabase JWTs
            issuer=f"{supabase_url}/auth/v1" # Default issuer for Supabase JWTs
        )
        # Here, you might fetch the user from your database based on decoded_payload['sub'] (user ID)
        # For simplicity, we just return the user ID from the JWT
        return {"user_id": decoded_payload["sub"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="JWT has expired",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid JWT: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying JWT: {e}",
        )
