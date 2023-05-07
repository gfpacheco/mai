# MAI API

## Develop

### API

1. Install Python 3.10, if not already installed.
1. Install poetry: `pip install poetry`
1. Create a new virtual environment with Python 3.10: `poetry env use python3.10`
1. Activate the virtual environment: `poetry shell`
1. Install app dependencies: `poetry install`
1. Set the required environment variables: `cp .env.example .env`
1. Run the API: `poetry run start`

### App

1. CD into the app directory: `cd app`
1. Install dependencies: `pnpm install`
1. Run dev script: `pnpm dev`

## Running like production

1. CD into the app directory: `cd app`
1. Run build script: `pnpm build`
1. Go back to root folder: `cd ..`
1. Run the API: `poetry run start`

API will now serve the app static assets as well.
