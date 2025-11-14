
KOLLEGEAPPLY - Assessment Project
=================================

What is included
----------------
- server.js (Node/Express) - serves static landing pages and provides API endpoints
- public/greenfield.html - Landing Page 1 (Greenfield Private University)
- public/riverside.html - Landing Page 2 (Riverside Institute of Management)
- public/assets/style.css - shared styles
- public/assets/wallpaper.svg - background wallpaper (education style)
- package.json
- .env.example

API Endpoints
-------------
- GET /api/universities         -> Returns list of universities (JSON)
- GET /api/universities/:id     -> Returns details for a university (use uni-1 or uni-2)
- POST /api/leads               -> Accepts lead form submissions (forwards to Pipedream if PIPEDREAM_ENDPOINT set in .env)
- GET /api/leads                -> View locally stored leads (for testing)

How to run locally (VS Code) - step by step
-------------------------------------------
1) Install Node.js (version 14 or later) if not already installed:
   https://nodejs.org/

2) Open VS Code.
   - File -> Open Folder -> select the extracted project folder (the folder that contains package.json)

3) Open a terminal in VS Code:
   - Terminal -> New Terminal

4) Install dependencies:
   - npm install

5) (Optional) If you want form submissions to be forwarded to Pipedream:
   - Create a Pipedream HTTP / Webhook source to get a unique endpoint URL (https://pipedream.com)
   - Copy the URL and create a file named .env in the project root with the line:
       PIPEDREAM_ENDPOINT=YOUR_PIPEDREAM_URL_HERE
     (or edit the .env.example and rename to .env)

6) Start the server:
   - npm start
   - Server will log: "Server running on port 3000"

7) Open the site in your browser:
   - http://localhost:3000
   - Click "Open Greenfield University" or "Open Riverside Institute"

How the lead form works
-----------------------
- The form posts to /api/leads (AJAX) and shows success/error messages without page refresh.
- If you set PIPEDREAM_ENDPOINT in .env, the server will forward the lead to that URL and return the Pipedream response status.
- If no PIPEDREAM_ENDPOINT is set, the server stores leads in-memory and /api/leads returns them as JSON (useful for local testing).

How to deploy on Render
-----------------------
1) Create a new public GitHub repository (name: kollegeapply-assessment).
2) Upload all project files to that repository (drag & drop or commit via git).
3) In Render dashboard -> New -> Web Service -> Connect GitHub -> select the repository.
4) Render will auto-detect Node. Set build command: npm install, start command: npm start.
5) Click "Create Web Service" and wait for the deploy to finish. You'll get a live URL.

Notes & testing tips
--------------------
- The project is designed to be fully functional locally without external services.
- The "Download Brochure" button is a placeholder (you can replace with a PDF in public/assets if needed).
- To view leads after submitting from a landing page, open http://localhost:3000/api/leads
