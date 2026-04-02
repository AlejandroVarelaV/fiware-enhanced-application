# United Supermarket

United Supermarket is a Manchester United themed FIWARE NGSIv2 application.
It combines Orion Context Broker, a Flask backend, and a static frontend to manage
store, product, employee, shelf, and inventory context data.

## Prerequisites

- Docker and Docker Compose
- Python 3.10+ (for local backend execution)
- pip
- Optional: a simple static server for frontend local mode

## Project Structure

- `backend/`: Flask API, services, routes, and tests
- `frontend/`: Static HTML/CSS/JS client
- `docker-compose.yml`: Orion, MongoDB, tutorial provider, backend, frontend
- `.env`: compose-level environment variables

## How To Run

### Option A: Full stack with Docker Compose (recommended)

```bash
docker compose up -d
```

Available endpoints:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Orion Context Broker: `http://localhost:1026`

To stop:

```bash
docker compose down
```

### Option B: Run backend locally + infrastructure in Docker

1. Start infrastructure:

```bash
docker compose up -d orion-v2 mongo-db tutorial
```

2. Run backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

3. Run frontend using any static server from repository root:

```bash
python -m http.server 3000 --directory frontend
```

## Environment Variables

Root `.env` (used by Docker Compose):

- `COMPOSE_PROJECT_NAME`
- `ORION_PORT`
- `ORION_VERSION`
- `MONGO_DB_PORT`
- `MONGO_DB_VERSION`
- `TUTORIAL_APP_PORT`
- `TUTORIAL_DUMMY_DEVICE_PORT`

Backend variables (see `backend/.env.example`):

- `FLASK_CONFIG`
- `FLASK_PORT`
- `LOG_LEVEL`
- `CORS_ORIGINS`
- `ORION_URL`
- `ORION_FIWARE_SERVICE`
- `ORION_FIWARE_SERVICEPATH`
- `HEALTH_CHECK_TIMEOUT`

## Seed Data

To load initial entities after Orion and backend are available:

```bash
cd backend
python seed_data.py
```

Run seed command against the same Orion instance configured in backend environment variables.