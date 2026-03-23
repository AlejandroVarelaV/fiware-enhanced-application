"""
Flask application entry point.

Start the backend server by running: python run.py
"""

import os
from dotenv import load_dotenv
from app import create_app


# Load environment variables from .env file
load_dotenv()

# Create Flask application
app = create_app()


if __name__ == '__main__':
    # Get configuration from environment
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_CONFIG', 'development') == 'development'
    
    # Run development server
    # Note: For production, use a production WSGI server like Gunicorn
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
    )
