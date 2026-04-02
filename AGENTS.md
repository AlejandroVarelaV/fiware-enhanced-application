# United Supermarket - Agent Instructions

## App Description

United Supermarket is a Manchester United themed smart retail application built on FIWARE NGSIv2.
It uses Orion Context Broker as the context data source, a Flask backend for API orchestration,
and a static frontend for user interaction.

## Mandatory Workflow (GitHub Flow)

Always follow this sequence for every change:

1. Create or reference a GitHub issue.
2. Create a dedicated branch from main.
3. Implement the change in that branch.
4. Commit with a clear message.
5. Push branch to remote.
6. Open PR and merge to main.

## Documentation Update Policy (Mandatory)

After finishing any issue, ALWAYS update all of these files so they reflect the real implemented state:
- PRD.md
- architecture.md
- data_model.md

## Code Conventions

- Prefer CSS over JavaScript for visual effects when both are possible.
- JavaScript must update existing HTML element attributes/values instead of injecting new HTML where feasible.
- Do not use <form> tags.

## File Structure Overview

```text
.
├── AGENTS.md
├── README.md
├── PRD.md
├── architecture.md
├── data_model.md
├── docker-compose.yml
├── .env
├── .gitignore
├── backend/
│   ├── run.py
│   ├── requirements.txt
│   ├── seed_data.py
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── config/
│   └── tests/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── services/
└── import-data
```
