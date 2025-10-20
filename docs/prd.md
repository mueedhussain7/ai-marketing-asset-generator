## PRD — MVP (brief)
Date: 2025-10-06

One-line goal
-------------
Enable non-designers to create one on-brand marketing image in under 2 minutes using a template and one-click AI.

Key inputs (MVP)
----------------
- Logo (one-time)
- Primary color
- Headline (required)
- Optional description
- One product photo

Must-have features
------------------
1. Brand setup (logo + color)
2. Template picker (6 templates)
3. One-click generate (ComfyUI → FLUX.1-dev or SDXL)
4. Store results in S3 and provide download + library
5. Basic email sign-up and session persistence

Tech stack
----------
- Frontend: React + TypeScript
- Backend: Node.js + Express (REST)
- AI: ComfyUI orchestrating FLUX.1-dev and SDXL
- Storage: AWS S3 (signed URLs)

Three clear milestones (actionable)
---------------------------------
Milestone A — Setup & smoke test (2–3 days)
- Tasks: create repo structure, env variables, test S3 bucket, start ComfyUI dev instance
- Smoke deliverable: POST /api/health and a test route that returns a placeholder image URL from S3

Milestone B — Server pipeline (7–10 days)
- Tasks: implement /api/generate (accepts template + assets), in-memory job queue, call ComfyUI with a workflow descriptor, upload output to S3 via `utils/s3Uploader.js`, persist job metadata in a JSON file or lightweight DB
- Deliverable: POST /api/generate returns jobId; GET /api/generate/:jobId returns status and signed S3 URL when ready

Milestone C — Frontend + basic UX (5–7 days)
- Tasks: React pages for sign-up, brand setup, template selection, generate flow with polling, and library list/download
- Deliverable: clickable flow where a user signs up, sets brand, generates an image, and downloads it

Acceptance criteria (short)
-------------------------
- End-to-end: user can sign up, set brand, generate an image, and download a valid S3 file.
- Backend runs ComfyUI workflows using FLUX.1-dev or SDXL and returns a signed URL.

Risks & quick mitigations
-------------------------
- Slow generation: use smaller image size, local ComfyUI, show progress, and add rate limits.
- Low-quality output: limit templates and tune prompts per template.
- S3 mistakes: default to private + signed URLs, user-specific prefixes.

Next steps (pick one)
---------------------
1. I break Milestone B into GitHub issues with estimates, or
2. I produce a short dev checklist and the exact commands to run ComfyUI locally.

Saved to `docs/prd.md` (brief, milestone-first). Reply which next step you want and I will execute it.
I want to build a web application that helps small business owners and marketers create professional-looking marketing images without needing any design skills. 

Features:
One-Time Brand Setup - Upload your logo and choose your brand colors once, and the app remembers them for all future designs
Template Selection - Choose from 15 pre-made templates for Instagram posts, Facebook banners, and posters to get started quickly
Simple Customization - Add your headline text, description, and product photo, then pick colors - no design experience needed
AI Generation - Click one button and wait 30 seconds while AI creates a professional marketing image automatically
- Download & Library - Download your design instantly in the right size, and access all your past designs anytime to reuse or re-download