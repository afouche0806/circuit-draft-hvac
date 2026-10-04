# Base44 Project

Use this repository to run and edit the app locally, then publish changes back through Base44.

**Important:** To sync changes automatically to Base44, this project must be connected to a remote Git repository (e.g., GitHub).

## Setup & Deployment

1. **Initialize Git Remote:** If not already configured, add a remote repository:
   ```bash
   git remote add origin <your-repository-url>
   git push -u origin main
   ```
2. **Commit and Push:** Commit your local changes and push to your remote repository.
3. **Publish via Dashboard:** Once pushed, open the Base44 dashboard:
   ```bash
   base44 dashboard open
   ```
   Then click **Publish** in the dashboard.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Base44 CLI: `npm install -g base44@latest`.
5. Install [Deno](https://docs.deno.com/runtime/getting_started/installation/) — the local Base44 backend runs on it.

Run `base44 --help` (or see the [CLI reference](https://docs.base44.com/developers/references/cli/commands/introduction)) for the full command surface.

## Run Locally

Three commands, from the project root:

```bash
npm install        # Run this first to install dependencies
base44 login       # one-time per machine
base44 link        # one-time per clone
base44 dev         # local backend + frontend together
```

Open the frontend URL that `base44 dev` prints (typically `http://localhost:5173`).

**Important:** Never run `npm run dev` yourself; always use `base44 dev` to ensure the backend proxy is correctly configured. If you encounter errors, ensure all dependencies are installed via `npm install`.

## Frontend Only, Hosted Backend

To work on just the frontend against your app's live hosted backend:

```bash
base44 dev --remote
```

⚠️ In this mode writes go to your app's **production data** — plain `base44 dev` keeps everything local.

## Docs & Support

GitHub integration: [https://docs.base44.com/developers/app-code/local-development/github](https://docs.base44.com/developers/app-code/local-development/github)

Local development: [https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)

Support: [https://app.base44.com/support](https://app.base44.com/support)
# circuit-draft-hvac
