# MAI API

## Quickstart

1. Install Python 3.10, if not already installed.
1. Install poetry: `pip install poetry`
1. Create a new virtual environment with Python 3.10: `poetry env use python3.10`
1. Activate the virtual environment: `poetry shell`
1. Install app dependencies: `poetry install`
1. Create a [bearer token](https://jwt.io)
1. Set the required environment variables: `cp .env.example .env`
1. Run the API locally: `poetry run start`
1. Access the API documentation at `http://0.0.0.0:8000/docs` and test the API endpoints (make sure to add your bearer token).
