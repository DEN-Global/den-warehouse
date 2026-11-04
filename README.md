# DEN warehouse partner workspace

React warehouse application backed by the sibling `den-backend` authenticated API. Forest green, lime and Manrope visual system with responsive owner, facility, team, employee, activity, security and administrator review screens.

## Local run

Use Node 24.22+. Clone both private repositories into sibling directories.

```sh
npm ci
npm run build
```

In `den-backend`, run `npm ci` then `npm run dev`. Open http://localhost:8787. This serves the built frontend and API on one origin. The local backend persists development-only data across restarts.

For frontend hot reload, run `npm run dev` here and start the backend with `DEN_APP_ORIGIN=http://localhost:5173 npm run dev`. Use http://localhost:5173 consistently to preserve same-origin cookie/CSRF behavior.

## Working flows

Register/sign in; register a business and facilities; submit for review; separately approve the business and facilities as an authorized fresh-MFA reviewer; invite/revoke team members; accept an email-bound invitation; record permission-checked operational notes. MFA setup has a real locally generated authenticator QR. Facility edits return to review.

All displayed business, facility, team and activity information comes from the API. No production transaction, shipment or revenue data is fabricated. Operational notes do not complete inventory accounting or secure delivery. International Trade is visibly locked by default.

## Verification and scope

Frontend production build and dependency audit pass. The backend has 54 automated tests including real workerd/D1 HTTP execution. Browser QA exercised owner registration, restart/reload persistence, administrative MFA approval, staff joining, permitted receiving and forbidden dispatch; mobile viewport verification remains outstanding. See [visual verification](docs/verification/README.md).

This is a development warehouse slice. Email verification/recovery, live documents/identity, production deployment, inventory ledger, complete custody workflow, offline sync and other DEN applications are unfinished. Test account approvals are not real business verification. No payments or provider booking is enabled.
