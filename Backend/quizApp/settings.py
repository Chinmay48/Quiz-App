from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# MySQL DB driver (Aiven)
import pymysql
pymysql.install_as_MySQLdb()

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------
# ⚠️ SECURITY SETTINGS
# ------------------------

SECRET_KEY = os.environ.get("SECRET_KEY", "unsafe-secret-for-dev")
DEBUG = os.environ.get("DEBUG", "False") == "True"

# Render provides the hostname dynamically
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

# ------------------------
# INSTALLED APPS
# ------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

INSTALLED_APPS += [
    'quizes',
    'accounts',
    'results',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# ------------------------
# MIDDLEWARE
# ------------------------

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",     # <-- ADD THIS
    "corsheaders.middleware.CorsMiddleware",          # <-- MUST BE AT TOP
    "django.middleware.common.CommonMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True  # allow frontend to access API

ROOT_URLCONF = 'quizApp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'quizApp.wsgi.application'

# ------------------------
# DATABASE (Aiven MySQL)
# ------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("DB_NAME", "defaultdb"),
        "USER": os.environ.get("DB_USER", "avnadmin"),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", ""),
        "PORT": os.environ.get("DB_PORT", "3306"),
        "OPTIONS": {
            "ssl": {
                "ca": BASE_DIR / "ca.pem",   # CA file must exist
            }
        },
    }
}

# ------------------------
# EMAIL SETTINGS
# ------------------------

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# ------------------------
# PASSWORD VALIDATION
# ------------------------

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ------------------------
# JWT SETTINGS
# ------------------------

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# ------------------------
# INTERNATIONALIZATION
# ------------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ------------------------
# STATIC FILES (Whitenoise)
# ------------------------

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
