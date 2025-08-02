## Setting up the backend

You need Python 3.12, Postgresql and virtualenv/pip

```bash
virtualenv .venv # to create a virtual environment

source .venv/bin/activate # to activate the virtual environment

pip install -r requirements.txt # to install the dependencies

cp .env.example .env # to copy the example environment variables

source .env # to load the environment variables

flask db migrate # to create the database migrations
flask db upgrade # to apply the migrations to the database

flask run --debug # to start the Flask server
```

Test the API by calling a sample test endpoint:

```bash
curl http://localhost:5000/api/test
```

Expected output:

```json
{
  "db_ping_time_ms": 4.79,
  "db_status": "OK",
  "timestamp": "2025-08-02T21:23:10.447074"
}
```

Folder structure:

```bash

├── app
│   ├── config.py
│   ├── controllers
│   │   ├── api_endpoints.py
│   ├── __init__.py
│   ├── models.py
│   ├── routes.py
│   └── schema.py
├── app.py
├── instance
│   └── app.db
├── migrations
│   ├── alembic.ini
│   ├── env.py
├── README.md
├── requirements.txt
└── static/uploads
```
