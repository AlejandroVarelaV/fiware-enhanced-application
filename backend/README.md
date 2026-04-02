# FIWARE Backend - Issue 1A Bootstrap

This directory contains the Flask backend for the FIWARE-enhanced smart retail application.

## Overview

This backend implements:
- Flask application with modular structure
- NGSIv2 HTTP client (OrionService) for Orion Context Broker integration
- Health check endpoint for monitoring
- Error handling framework
- Configuration management for development and production

## Prerequisites

- Python 3.8+
- Virtual environment (recommended)
- Orion Context Broker running (Docker Compose or local installation)

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Copy `.env.example` to `.env` and adjust settings if needed:

```bash
cp .env.example .env
```

Edit `.env` to match your Orion setup. Default values are:
- `FLASK_CONFIG=development`
- `FLASK_PORT=5000`
- `ORION_URL=http://localhost:1026`
- `ORION_FIWARE_SERVICE=smart_retail`
- `ORION_FIWARE_SERVICEPATH=/`

**Docker Setup Note:** If Orion is running in Docker, you may need to use:
```
ORION_URL=http://host.docker.internal:1026
```

## Running the Backend

```bash
python run.py
```

Server will start on `http://localhost:5000`

## Health Check

Verify backend and Orion connectivity:

```bash
curl http://localhost:5000/api/health
```

Expected response when both are healthy:
```json
{
  "status": "ok",
  "orion": "connected",
  "orion_url": "http://localhost:1026",
  "timestamp": "2026-03-23T10:30:00Z"
}
```

If Orion is not reachable, you'll receive a 503 response:
```json
{
  "status": "ok",
  "orion": "disconnected",
  "orion_url": "http://localhost:1026",
  "message": "Orion Context Broker is not responding",
  "timestamp": "2026-03-23T10:30:00Z"
}
```

## Notifications and Subscriptions

The backend automatically registers two NGSIv2 subscriptions when the application starts:
- Product price change alerts for `Product.price` updates.
- Low stock alerts for `InventoryItem.stockCount` values below the configured threshold.

Subscription creation is idempotent. Existing subscriptions are checked by description before new ones are created, so restarting the backend does not duplicate them.

Orion notifications are delivered to the backend callback endpoint:

```text
POST /api/notifications
```

The backend logs incoming Orion notifications and emits them to connected browsers through Socket.IO on the `orion_notification` event.

The frontend listens for that event and logs the raw payload in the browser console. The notification panel also shows a short summary so you can verify delivery quickly.

## Real-Time Notifications (Orion + Socket.IO)

### How it works

- Orion subscriptions are created automatically at backend startup.
- Backend exposes callback endpoint `POST /api/notifications`.
- Incoming Orion notification payloads are forwarded through Flask-SocketIO.
- Backend emits Socket.IO event `orion_notification` to connected frontend clients.
- Frontend receives the event and updates notifications in real time.

### Example test

```bash
curl -X PATCH http://localhost:1026/v2/entities/product-001/attrs \
-H "Content-Type: application/json" \
-H "Fiware-Service: smart_retail" \
-d '{ "price": { "type": "Number", "value": 999 } }'
```

### Manual testing

List subscriptions:

```bash
curl -H "Fiware-Service: smart_retail" http://localhost:1026/v2/subscriptions
```

Trigger a product price change:

```bash
curl -X PATCH http://localhost:1026/v2/entities/product-001/attrs \
   -H "Content-Type: application/json" \
   -H "Fiware-Service: smart_retail" \
   -d '{ "price": { "type": "Number", "value": 999 } }'
```

Expected backend log output includes:

```text
Received Orion notification
```

### Docker networking note

In this Linux environment, `host.docker.internal` was not reliable for Orion callbacks.
Use the Docker bridge gateway address instead:

```text
http://172.17.0.1:5000/api/notifications
```

That is the callback URL configured in the backend.

## Project Structure

```
backend/
├── app/                        Flask application package
│   ├── __init__.py            Application factory (create_app)
│   ├── services/              Business logic and external integrations
│   │   └── orion_service.py   NGSIv2 HTTP client for Orion
│   ├── routes/                API endpoint blueprints
│   │   └── health_routes.py   Health check endpoints
│   ├── models/                Data models and exceptions
│   │   └── exceptions.py      Custom exception classes
│   └── utils/                 Utility functions
│       └── logger.py          Logging configuration
├── config/                    Configuration management
│   └── config.py             Flask configuration classes
├── tests/                     Test directory (placeholder)
├── run.py                     Application entry point
├── requirements.txt           Python dependencies
├── .env.example              Example environment variables
└── README.md                 This file
```

## Architecture Notes

### OrionService
The `OrionService` class abstracts all HTTP communication with Orion:
- **CRUD Operations**: `create_entity()`, `get_entity()`, `list_entities()`, `update_entity_attrs()`, `delete_entity()`
- **Special Operations**: `patch_entity_increment()` for atomic increment operations (e.g., buy-one-unit)
- **Error Handling**: Custom exceptions for connection errors, not found, and API errors
- **Logging**: Comprehensive logging for debugging and monitoring

### Configuration System
- **DevelopmentConfig**: Debug enabled, verbose logging
- **ProductionConfig**: Debug disabled, minimal logging
- **TestingConfig**: For unit tests

Environment variables control which config is active via `FLASK_CONFIG` variable.

### Error Handling
Global error handlers for:
- Orion connection errors (503)
- Entity not found errors (404)
- Validation/application errors (400)
- Unexpected errors (500)

All errors return consistent JSON format with error code and message.

## Next Steps

After Issue 1A is complete:
- **Issue 1B**: Implement CRUD endpoints for Product and Store
- **Issue 1C**: Implement CRUD endpoints for Employee, Shelf, InventoryItem with full validation
- **Issue 2**: Add subscription registration and external context provider callback handling
- **Issue 3**: Implement Socket.IO for real-time client updates

## Development Tips

### Debugging
Enable debug logging by setting in `.env`:
```
FLASK_CONFIG=development
LOG_LEVEL=DEBUG
```

### Testing Orion Connectivity
```bash
# Direct Orion API test
curl http://localhost:1026/version

# Backend health check
curl http://localhost:5000/api/health

# Check logs in backend terminal for detailed error messages
```

### Running Backend in Different Environments
```bash
# Production mode
FLASK_CONFIG=production python run.py

# Testing mode
FLASK_CONFIG=testing python run.py
```

## Troubleshooting

### "Orion Context Broker is not responding"

1. Check Orion is running:
   ```bash
   docker ps | grep orion
   ```

2. Test Orion directly:
   ```bash
   curl http://localhost:1026/version
   ```

3. If using Docker, verify the backend can reach Orion:
   - From backend container: use `http://host.docker.internal:1026` or Docker service name
   - From host machine: use `http://localhost:1026`

4. Check firewall/network settings

### "Connection refused" errors

- Ensure Orion is started (see docker-compose.yml in project root)
- Verify ORION_URL in `.env` is correct
- Check network connectivity

### Python package installation fails

- Ensure Python 3.8+ is installed
- Try upgrading pip: `pip install --upgrade pip`
- Create fresh virtual environment

## Questions or Issues?

Refer to the project documentation:
- `PRD.md` - Product requirements and user stories
- `architecture.md` - System architecture and design patterns
- `data_model.md` - Entity definitions and relationships
