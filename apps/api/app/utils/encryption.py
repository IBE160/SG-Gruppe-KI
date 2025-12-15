from cryptography.fernet import Fernet
from app.core.config import settings
from loguru import logger

class EncryptionUtil:
    def __init__(self):
        try:
            # Ensure the key is bytes and correctly padded
            self.fernet = Fernet(settings.ENCRYPTION_KEY.encode('utf-8'))
        except Exception as e:
            logger.error(f"Failed to initialize Fernet. Check ENCRYPTION_KEY in config: {e}")
            raise

    def encrypt(self, data: str) -> str:
        """Encrypts a string."""
        if not data:
            return ""
        encrypted_data = self.fernet.encrypt(data.encode('utf-8'))
        return encrypted_data.decode('utf-8')

    def decrypt(self, encrypted_data: str) -> str:
        """Decrypts a string."""
        if not encrypted_data:
            return ""
        decrypted_data = self.fernet.decrypt(encrypted_data.encode('utf-8'))
        return decrypted_data.decode('utf-8')

encryption_util = EncryptionUtil()
