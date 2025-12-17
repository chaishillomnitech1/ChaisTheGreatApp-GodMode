---
name: Vercel Setup Request
about: Request Vercel deployment configuration and setup
title: '[VERCEL] Setup deployment for [PROJECT_NAME]'
labels: 'deployment, vercel, infrastructure'
assignees: 'chaishillomnitech1'
---

## Vercel Deployment Setup Request

### Project Information

**Project Name:** 
**Repository:** 
**Branch to Deploy:** `main` / `develop` / other: ___

### Deployment Configuration

- [ ] New Vercel project needed
- [ ] Existing project - update configuration
- [ ] Custom domain configuration needed

### Required Environment Variables

Please configure the following secrets in Vercel:

**Essential:**
- [ ] `NODE_ENV` (production)
- [ ] `VERCEL_TOKEN` 
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`

**API Keys:**
- [ ] `OPENAI_API_KEY`
- [ ] `REWARDS_API_KEY`
- [ ] `ALCHEMY_MUMBAI_URL`

**Blockchain (Testnet):**
- [ ] `REWARDS_PRIVATE_KEY` (testnet wallet only)
- [ ] `REWARDS_CONTRACT_ADDRESS`
- [ ] `PILOT_TEST_WALLET`

**GitHub:**
- [ ] `GITHUB_PAT` (for repo-sync)

### Additional Configuration

**Build Settings:**
- Framework Preset: ___
- Build Command: `npm run build` / other: ___
- Output Directory: `dist` / `build` / other: ___
- Install Command: `npm ci` / other: ___

**Node.js Version:**
- [ ] Node.js 20 (recommended)
- [ ] Node.js 18
- [ ] Other: ___

### Deployment Regions

- [ ] US East (iad1) - Default
- [ ] US West (sfo1)
- [ ] Europe (fra1)
- [ ] Other: ___

### GitHub Integration

- [ ] Enable automatic deployments
- [ ] Enable preview deployments for PRs
- [ ] Enable auto-alias for production
- [ ] Enable auto-job cancellation

### Security Requirements

- [ ] Testnet-only deployment confirmed
- [ ] No mainnet keys or production secrets
- [ ] Environment variable encryption verified
- [ ] `.vercelignore` configured to exclude sensitive files
- [ ] `.env` files added to `.gitignore`

### Post-Deployment Verification

After deployment, verify:
- [ ] Production deployment successful
- [ ] Preview deployments working for PRs
- [ ] Environment variables loaded correctly
- [ ] Custom domains resolved (if applicable)
- [ ] Monitoring and analytics enabled

### Additional Context

<!-- Add any additional information about the deployment requirements -->

### Checklist Before Submitting

- [ ] All required secrets documented
- [ ] No actual secret values included in this issue
- [ ] Deployment configuration reviewed
- [ ] Security requirements confirmed

---

**Priority:** Low / Medium / High / Critical

**Target Deployment Date:** YYYY-MM-DD

**Assignee:** @chaishillomnitech1

---

### Setup Instructions Reference

For detailed setup instructions, see:
- [`DEPLOYMENT.md`](../../DEPLOYMENT.md)
- [`.vercel.json`](../../.vercel.json) configuration
- [`.env.example`](../../.env.example) for required variables

### Support

For issues or questions, tag @chaishillomnitech1 or contact the DevOps team.
