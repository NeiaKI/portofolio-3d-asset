<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Branch Convention

- **`master`** — local development only. Use `npm run dev` to test here. Never deploy directly from this branch.
- **`vercel-deploy`** — Vercel production branch. Only merge here when a feature is tested and ready. Pushing to `vercel-deploy` triggers Vercel deployment.

Workflow:
1. Develop and test on `master` locally
2. When ready: `git checkout vercel-deploy && git merge master && git push`
