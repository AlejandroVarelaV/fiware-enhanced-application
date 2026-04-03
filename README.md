# United Supermarket

United Supermarket is a Manchester United themed FIWARE NGSIv2 smart retail application.
It uses Orion Context Broker, a Flask backend, and a static frontend.

## GitHub Repository

https://github.com/AlejandroVarelaV/fiware-enhanced-application

## Run Instructions (Final Delivery)

1. Start containers:

```bash
docker-compose up -d
```

2. Install backend dependencies:

```bash
cd backend && pip install -r requirements.txt
```

3. Seed data:

```bash
python seed_data.py
```

4. Run backend:

```bash
python run.py
```

Frontend is served by Docker at:
- http://localhost:3000

Backend API is available at:
- http://localhost:5000

Orion is available at:
- http://localhost:1026

## Environment Variables

### Root .env (Compose and project defaults)

- `COMPOSE_PROJECT_NAME`
- `ORION_PORT`
- `ORION_VERSION`
- `MONGO_DB_PORT`
- `MONGO_DB_VERSION`
- `TUTORIAL_APP_PORT`
- `TUTORIAL_DUMMY_DEVICE_PORT`
- `FLASK_CONFIG`
- `FLASK_PORT`
- `LOG_LEVEL`
- `CORS_ORIGINS`
- `ORION_URL`
- `ORION_FIWARE_SERVICE`
- `ORION_FIWARE_SERVICEPATH`
- `HEALTH_CHECK_TIMEOUT`

### Backend runtime variables used by code

- `FLASK_CONFIG`
- `FLASK_PORT`
- `LOG_LEVEL`
- `CORS_ORIGINS`
- `ORION_URL`
- `ORION_FIWARE_SERVICE`
- `ORION_FIWARE_SERVICEPATH`
- `ORION_NOTIFICATION_URL`
- `LOW_STOCK_THRESHOLD`
- `HEALTH_CHECK_TIMEOUT`

## Notes

- Notifications from Orion to backend use `ORION_NOTIFICATION_URL`.
- The backend registers subscriptions and external context providers on startup.