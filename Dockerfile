FROM node:18-alpine as frontend-stage

ENV VITE_API_URL=/api

WORKDIR /tmp

COPY ./app/package.json ./app/pnpm-lock.yaml /tmp/

RUN npm install -g pnpm && pnpm install

COPY ./app /tmp

RUN pnpm run build

FROM python:3.10 as requirements-stage

WORKDIR /tmp

RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock* /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.10

WORKDIR /code

COPY --from=frontend-stage /tmp/dist /code/app/dist

COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/

# Heroku uses PORT, Azure App Services uses WEBSITES_PORT, Fly.io uses 8080 by default
CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-${WEBSITES_PORT:-8080}}"]
