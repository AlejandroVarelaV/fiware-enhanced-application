# Issue #1A: Bootstrap Flask Backend and Implement OrionService

## Overview

This issue establishes the foundational backend infrastructure for the FIWARE-enhanced application. It focuses on:
- Setting up the Flask application structure and configuration
- Implementing the NGSIv2 HTTP client (OrionService)
- Creating the health check endpoint for backend/Orion connectivity verification

This is the **first step** of a three-part backend bootstrap cycle. Subsequent issues will build CRUD endpoints and validation on top of this foundation.

**Estimated Effort**: 1-2 days

## Scope (IN)

- Flask application factory and modular structure
- Configuration management (development/production modes)
- Environment variable handling via python-dotenv
- OrionService: Low-level NGSIv2 HTTP client abstraction
- Health check endpoint (GET /api/health)
- Structured logging setup
- Error handling foundation (custom exception classes)
- Dependencies in requirements.txt
- .env.example documentation

## Scope (OUT)

- CRUD API endpoints
- Entity services or business logic
- Data validation beyond HTTP validation
- Subscription or notification handling
- Socket.IO implementation
- External context provider registration
- Frontend integration

## Acceptance Criteria

### Flask Application Bootstrap
- [ ] Backend directory structure created as specified
- [ ] Flask application factory pattern implemented in `app/__init__.py`
- [ ] Application starts without errors: `python run.py`
- [ ] Server runs on configurable port (default 5000)
- [ ] No unhandled exceptions on startup
- [ ] Structured logging configured and functional

### Configuration Management
- [ ] `config/config.py` contains development and testing configurations
- [ ] Environment variables loaded from `.env` via python-dotenv
- [ ] `.env.example` documents all required variables with descriptions
- [ ] ORION_URL, ORION_FIWARE_SERVICE, ORION_FIWARE_SERVICEPATH are configurable
- [ ] Flask debug mode controlled by environment variable
- [ ] host.docker.internal referenced in documentation for Docker scenarios

### OrionService Implementation
- [ ] `app/services/orion_service.py` implements low-level NGSIv2 client
- [ ] Constructor accepts: base_url, fiware_service, fiware_servicepath
- [ ] HTTP client properly configured with headers:
  - Content-Type: application/json
  - Accept: application/json
  - Fiware-Service and Fiware-ServicePath headers included
- [ ] Connection validation method implemented (can ping Orion)
- [ ] All HTTP calls wrapped with sensible error handling
- [ ] Meaningful error messages on connection failures
- [ ] Methods implemented:
  - `create_entity(entity_type, entity_data)` → POST /v2/entities
  - `get_entity(entity_id)` → GET /v2/entities/{id}
  - `list_entities(entity_type=None)` → GET /v2/entities with optional type filter
  - `update_entity_attrs(entity_id, attrs)` → PATCH /v2/entities/{id}/attrs
  - `delete_entity(entity_id)` → DELETE /v2/entities/{id}
- [ ] All methods return parsed JSON responses or raise descriptive exceptions
- [ ] Requests/responses logged for debugging

### Health Check Endpoint
- [ ] GET /api/health endpoint implemented in `app/routes/health_routes.py`
- [ ] Response format: `{ "status": "ok", "orion": "connected", "timestamp": "ISO-8601" }`
- [ ] Returns 200 when backend and Orion are both healthy
- [ ] Returns 503 with `"orion": "disconnected"` when Orion unreachable
- [ ] Endpoint responds within 2 seconds even if Orion is slow

### Error Handling Foundation
- [ ] `app/models/exceptions.py` defines custom exception classes:
  - `OrionConnectionError`
  - `OrionEntityNotFoundError`
  - `OrionAPIError`
  - `ValidationError`
- [ ] Flask global error handler registered
- [ ] All unhandled exceptions logged with context
- [ ] Error responses include HTTP status code and message

### Dependencies and Documentation
- [ ] `backend/requirements.txt` created with all core dependencies:
  - Flask==2.x
  - requests==2.x
  - python-dotenv==0.x
  - python-dateutil==2.x
- [ ] `backend/.env.example` documents all environment variables
- [ ] `backend/README.md` created with:
  - Python version requirement (3.8+)
  - Virtual environment setup instructions
  - Dependency installation instructions
  - How to configure environment variables
  - How to run the Flask development server
  - Orion Docker Compose reference
- [ ] `.gitignore` updated to exclude `.env`, `__pycache__`, `.venv`, `*.pyc`, `*.log`

### Integration Testing
- [ ] Backend starts successfully with valid Orion URL configured
- [ ] Health check endpoint responds correctly when Orion is running
- [ ] Health check endpoint fails gracefully when Orion is unreachable
- [ ] OrionService can successfully communicate with Orion (tested manually)
- [ ] Logs show connection activity and any errors

## Implementation Tasks

### Task A1: Create Backend Directory Structure
- [ ] Create `/backend` directory from project root
- [ ] Create `/backend/app` (Flask package)
- [ ] Create `/backend/app/services`
- [ ] Create `/backend/app/routes`
- [ ] Create `/backend/app/models`
- [ ] Create `/backend/app/utils`
- [ ] Create `/backend/config`
- [ ] Create `/backend/tests` (empty placeholder)
- [ ] Create stub `__init__.py` files in all packages

### Task A2: Implement Configuration System
- [ ] Create `backend/config/config.py` with:
  - `Config` base class
  - `DevelopmentConfig` (debug=True, testing=False)
  - `ProductionConfig` (debug=False, testing=False)
- [ ] Create `backend/config/__init__.py` to export config classes
- [ ] Use environment variable CONFIG_MODE to select active config

### Task A3: Create Flask Application Factory
- [ ] Create `backend/app/__init__.py` with `create_app()` factory function
- [ ] Load configuration from environment
- [ ] Register CORS (permissive for development, can be tightened later)
- [ ] Set up structured logging using Python logging module
- [ ] Register error handlers for common HTTP errors
- [ ] Return initialized Flask app

### Task A4: Implement OrionService
- [ ] Create `backend/app/services/orion_service.py`
- [ ] Implement `OrionService` class with:
  - Constructor accepting base_url, fiware_service, fiware_servicepath
  - `_set_headers()` method to configure NGSIv2 HTTP headers
  - `_handle_response(response)` method for consistent response parsing
  - `check_connection()` method to validate Orion reachability
  - `create_entity(entity_type, entity_data)`
  - `get_entity(entity_id)`
  - `list_entities(entity_type=None)`
  - `update_entity_attrs(entity_id, attrs)`
  - `delete_entity(entity_id)`
- [ ] Create `backend/app/services/__init__.py` to export OrionService

### Task A5: Implement Custom Exceptions
- [ ] Create `backend/app/models/exceptions.py` with:
  - `OrionConnectionError` - for connection issues
  - `OrionEntityNotFoundError` - for 404 responses
  - `OrionAPIError` - for general API errors
  - `ValidationError` - for future validation use
- [ ] Create `backend/app/models/__init__.py` to export exceptions

### Task A6: Implement Health Check Endpoint
- [ ] Create `backend/app/routes/health_routes.py` with:
  - Blueprint: `health_bp`
  - Optional dependency injection of OrionService
  - GET /api/health endpoint
- [ ] Create `backend/app/routes/__init__.py`
- [ ] Register health_bp in Flask app factory

### Task A7: Create Requirements and Documentation
- [ ] Create `backend/requirements.txt` with core dependencies
- [ ] Create `backend/.env.example` with:
  - FLASK_CONFIG (default: development)
  - FLASK_PORT (default: 5000)
  - ORION_URL (example: http://localhost:1026)
  - ORION_FIWARE_SERVICE (example: smart-retail)
  - ORION_FIWARE_SERVICEPATH (example: /)
  - LOG_LEVEL (default: INFO)
- [ ] Create `backend/README.md` with setup and run instructions
- [ ] Update root `.gitignore` with backend-specific patterns

### Task A8: Create Application Entry Point
- [ ] Create `backend/run.py` with:
  - Import `create_app` from app factory
  - Read FLASK_PORT from environment
  - Call `app.run(host='0.0.0.0', port=port)`
- [ ] Ensure `run.py` is executable from backend directory

### Task A9: Manual Integration Testing
- [ ] Start Docker Compose with Orion, MongoDB (from project root)
- [ ] Create `.env` in backend from `.env.example`
- [ ] Set ORION_URL to appropriate value (localhost:1026 or host.docker.internal:1026)
- [ ] Run `cd backend && python run.py`
- [ ] Test: `curl http://localhost:5000/api/health`
- [ ] Verify response includes `"orion": "connected"`
- [ ] Stop Orion container and refresh `/api/health`
- [ ] Verify response includes `"orion": "disconnected"` (or similar error detection)
- [ ] Verify logs show connection attempts and any errors
- [ ] Restart Orion and verify reconnection works

## Files to Create

```
backend/
├── app/
│   ├── __init__.py                 (Flask factory)
│   ├── services/
│   │   ├── __init__.py
│   │   └── orion_service.py        (NGSIv2 HTTP client)
│   ├── routes/
│   │   ├── __init__.py
│   │   └── health_routes.py        (health endpoint)
│   ├── models/
│   │   ├── __init__.py
│   │   └── exceptions.py           (custom exceptions)
│   └── utils/
│       └── __init__.py
├── config/
│   ├── __init__.py
│   └── config.py                   (Flask config classes)
├── tests/
│   └── __init__.py
├── run.py                          (entry point)
├── requirements.txt
├── .env.example
└── README.md
```

## Testing Instructions

### Prerequisites
- Docker and Docker Compose running (Orion/MongoDB started)
- Python 3.8+ installed
- Terminal/shell access

### Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate (Windows)
pip install -r requirements.txt
cp .env.example .env
# Edit .env if needed (adjust ORION_URL for your setup)
```

### Run
```bash
python run.py
# Server starts on http://localhost:5000
```

### Verify
```bash
# In another terminal:
curl http://localhost:5000/api/health
# Expected response: { "status": "ok", "orion": "connected", "timestamp": "2026-03-23T..." }

# Check logs in the first terminal for connection details
```

## GitHub Flow Checklist

- [ ] Create GitHub issue from this description
- [ ] Create branch: `git checkout -b feature/1a-backend-bootstrap`
- [ ] Commit incrementally as tasks complete
- [ ] Push branch: `git push origin feature/1a-backend-bootstrap`
- [ ] Upon completion, merge to main
- [ ] After merge, update `architecture.md` to document Flask structure

## Dependencies for Next Issues

**Issue 1B** will depend on this issue completing:
- Issue 1B assumes Flask app factory is working
- Issue 1B will add entity services and CRUD endpoints
- Issue 1B will use OrionService from this issue

## Notes and Considerations

1. **Orion Connectivity**: Test both localhost (if Orion runs locally) and host.docker.internal (if Orion runs in Docker).

2. **Error Logging**: All connection errors logged; this forms the debugging foundation for subsequent issues.

3. **Future-Proof Configuration**: Configuration is intentionally minimal here; additional settings (Socket.IO, subscription callbacks) will be added in later issues.

4. **Health Check Design**: The health check proactively pings Orion; this is acceptable for now. In production, consider caching to avoid excessive calls.

5. **No CRUD Yet**: This issue intentionally stops at the service layer. Entity-specific logic and validation are deferred to Issues 1B and 1C.

6. **Logging Foundation**: Structured logging set up here will be reused throughout the application for consistency.
