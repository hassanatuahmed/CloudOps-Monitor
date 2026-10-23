# CloudOps Monitor

A small containerized Node.js/Express service demonstrating Docker, CI, cloud deployment, health checks, and operational logging.

## Architecture

1. Code is pushed to GitHub.
2. GitHub Actions installs dependencies, checks syntax, runs tests, and builds the Docker image.
3. Render connects to this GitHub repository, builds the Dockerfile, and deploys the service after commits to the configured branch.
4. Render checks `GET /health` to determine whether the service is healthy.

**Important CI/CD distinction:** GitHub Actions performs CI and Docker build validation. Render independently deploys from GitHub. With Render auto-deploy enabled, a failed Actions run does not automatically block Render deployment. To enforce a strict gate, disable auto-deploy and trigger Render only after CI succeeds using a deploy hook/API stored as a GitHub secret.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Welcome message and version |
| GET | `/health` | Health status and uptime |
| GET | `/info` | Application and runtime information |
| GET | `/version` | Application name and version |
| GET | Unknown path | JSON 404 |

## Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop or Docker Engine
- Git and GitHub account
- Render account

## Run locally

```bash
git clone https://github.com/YOUR_USERNAME/cloudops-monitor.git
cd cloudops-monitor
npm install
npm run check
npm test
npm start
```

Open `http://localhost:3000`, `http://localhost:3000/health`, `http://localhost:3000/info`, and `http://localhost:3000/version`.

Copy `.env.example` to `.env` if you want to practise local configuration. The application has defaults and does not require the file. Never commit secrets.

## Run with Docker

```bash
docker build -t cloudops-monitor:local .
docker run --rm -p 3000:3000 -e NODE_ENV=production cloudops-monitor:local
```

Test and inspect:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/info
docker ps
docker logs <container_id>
docker inspect --format='{{json .State.Health}}' <container_id>
```

## Push to GitHub

Create an empty GitHub repository named `cloudops-monitor`, then run these commands in the project directory:

```bash
git init
git add .
git commit -m "Build CloudOps Monitor with tests and Docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cloudops-monitor.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. If you already have a repository, add these files to it instead.

The workflow `.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`. It installs dependencies, checks syntax, runs tests, and builds the Docker image.

## Deploy to Render

### Option A: Dashboard

1. Push the repository to GitHub.
2. Sign in at https://dashboard.render.com/.
3. Select **New** → **Web Service**, then connect the repository.
4. Select the Docker runtime / Dockerfile option.
5. Set the branch to `main` and Dockerfile path to `./Dockerfile`.
6. Set the health check path to `/health`.
7. Set environment variables:
   - `NODE_ENV` = `production`
   - `APP_NAME` = `CloudOps Monitor`
   - `APP_VERSION` = `1.0.0`
8. Create the service and wait for deployment.
9. Open the Render URL and verify `/`, `/health`, and `/info`.

The app listens on `process.env.PORT` and binds to `0.0.0.0`.

### Option B: Blueprint

The included `render.yaml` can be used as a Render Blueprint. In the dashboard, create a Blueprint and select this repository. Review the plan and settings before applying. Confirm current plan availability and pricing in Render.

## CI/CD behavior

- Pull requests run checks and tests but do not deploy by themselves.
- Pushes to `main` run CI. Render also detects the repository update and deploys if auto-deploy is enabled.
- A failed GitHub Actions run does not automatically block Render's independent Git integration. For a strict gate, disable Render auto-deploy and trigger a deploy hook only after CI passes. Store the hook URL as a GitHub Actions secret; never commit it.

## Troubleshooting

- **Service fails to start:** inspect Render logs; confirm the start command is `node src/server.js`.
- **Port issue:** use `process.env.PORT` and bind to `0.0.0.0`.
- **Health check fails:** open `/health` and inspect startup logs.
- **`npm install` fails:** check the Node version and package registry connectivity. Commit a `package-lock.json` for reproducible CI installs once generated locally.
- **Docker build fails:** run `docker build -t cloudops-monitor:local .` and inspect the first failing step.
- **Render deploys despite failed CI:** disable auto-deploy and implement a CI-success-gated deployment if strict gating is required.

## Security and reliability checklist

- [ ] No secrets committed to Git.
- [ ] Container runs as a non-root user.
- [ ] Unknown routes return a controlled JSON 404.
- [ ] Health endpoint returns HTTP 200.
- [ ] CI checks pass before merging.
- [ ] Render logs checked after deployment.
- [ ] Dependencies and GitHub Actions versions reviewed periodically.

## Advanced improvements

- Add rate limiting and request IDs.
- Add structured request logging and error handling.
- Add dependency and container vulnerability scanning.
- Add a staging service and release promotion.
- Add CI-gated deployment and rollback documentation.
- Add external uptime monitoring.

## Learning outcomes

This project demonstrates application packaging, automated testing, container image building, cloud deployment, runtime configuration, and operational troubleshooting.
