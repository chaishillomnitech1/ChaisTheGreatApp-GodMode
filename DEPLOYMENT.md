# Phase 2 Workflows - Deployment Guide

This guide provides comprehensive setup instructions for the Phase 2 workflows implemented in this repository. These workflows enhance operational velocity, collaboration efficiency, and reward transparency while maintaining robust security standards.

## Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
- [Required Secrets](#required-secrets)
- [Setup Instructions](#setup-instructions)
- [Security Guardrails](#security-guardrails)
- [Troubleshooting](#troubleshooting)

---

## Overview

Phase 2 introduces three powerful automation workflows:

1. **AI-Powered PR Assistant** - Automatically generates PR summaries, suggests labels, and creates changelog entries using OpenAI
2. **Reward Allocation** - Mints OmniRewards tokens to contributors when their PRs are merged (testnet deployment)
3. **Repo-Sync Action** - Enables bidirectional synchronization with the `omnitech-templates` repository for centralized workflow management

---

## Workflows

### 1. AI-Powered PR Assistant (`.github/workflows/pr-assistant.yml`)

**Triggers:**
- When a PR is opened, synchronized, or reopened
- Targets `main` and `develop` branches

**Features:**
- Analyzes PR title, description, and diff using OpenAI GPT-3.5
- Generates comprehensive PR summaries
- Suggests appropriate labels (bug, enhancement, documentation, security, etc.)
- Creates changelog entries automatically
- Posts results as a comment on the PR

**Requirements:**
- `OPENAI_API_KEY` secret (required)

---

### 2. Reward Allocation (`.github/workflows/reward-allocation.yml`)

**Triggers:**
- When a PR is merged into `main`

**Features:**
- Calculates reward amounts based on PR size:
  - Small PR (< 50 lines): 1x base reward (10 tokens)
  - Medium PR (50-200 lines): 1.5x base reward (15 tokens)
  - Large PR (> 200 lines): 2x base reward (20 tokens)
- Mints OmniRewards tokens via smart contract on Polygon Mumbai testnet
- Posts reward notification with transaction details
- **Staging mode**: Runs safely without secrets (simulation only)

**Requirements (for live deployment):**
- `ALCHEMY_MUMBAI_URL` - Alchemy API URL for Polygon Mumbai testnet
- `REWARDS_PRIVATE_KEY` - Private key with minting privileges on OmniRewards contract
- `OMNIREWARDS_CONTRACT_ADDRESS` - Deployed OmniRewards contract address
- `CONTRIBUTOR_ADDRESS` (optional) - Default recipient address (defaults to PR author)

**Security Features:**
- Testnet-only deployment (Mumbai)
- Graceful degradation to staging mode if secrets missing
- Transaction verification and logging
- Network validation checks

---

### 3. Repo-Sync Action (`.github/workflows/repo-sync.yml`)

**Triggers:**
- Manual dispatch (workflow_dispatch) with configurable direction and files
- Scheduled daily at 2 AM UTC (pull sync)
- Push to `main` branch affecting workflows or DEPLOYMENT.md (push sync)

**Features:**
- **Pull Sync**: Fetches updates from `omnitech-templates` to keep workflows current
- **Push Sync**: Pushes local workflow changes back to template repository
- Configurable file/directory selection
- Automated commit and PR creation

**Requirements:**
- `TEMPLATE_REPO_URL` (optional) - Template repository (default: `chaishillomnitech1/omnitech-templates`)
- `SYNC_PAT` (optional for pull, required for push) - Personal Access Token with repo access

---

## Required Secrets

Configure these secrets in **GitHub Settings → Secrets and variables → Actions → New repository secret**:

### Critical Secrets (Required for Production)

| Secret Name | Description | Required For | Example Value |
|------------|-------------|--------------|---------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-3.5 | PR Assistant | `sk-proj-...` |
| `ALCHEMY_MUMBAI_URL` | Alchemy RPC URL for Mumbai testnet | Reward Allocation | `https://polygon-mumbai.g.alchemy.com/v2/YOUR-API-KEY` |
| `REWARDS_PRIVATE_KEY` | Private key for minting wallet | Reward Allocation | `0x1234...` (64 hex chars) |
| `OMNIREWARDS_CONTRACT_ADDRESS` | OmniRewards contract on Mumbai | Reward Allocation | `0xABCD...` (42 hex chars) |

### Optional Secrets (Enhanced Features)

| Secret Name | Description | Required For | Example Value |
|------------|-------------|--------------|---------------|
| `CONTRIBUTOR_ADDRESS` | Default reward recipient address | Reward Allocation | `0x5678...` |
| `TEMPLATE_REPO_URL` | Template repository identifier | Repo-Sync | `chaishillomnitech1/omnitech-templates` |
| `SYNC_PAT` | Personal Access Token for repo sync | Repo-Sync (push) | `ghp_...` |

---

## Setup Instructions

### Step 1: AI-Powered PR Assistant Setup

1. **Obtain OpenAI API Key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-proj-` or `sk-`)

2. **Add Secret to Repository:**
   ```
   GitHub Repository → Settings → Secrets and variables → Actions → New repository secret
   Name: OPENAI_API_KEY
   Value: [paste your API key]
   ```

3. **Test the Workflow:**
   - Open a test PR
   - Verify the bot comments with summary, labels, and changelog
   - Check that suggested labels are applied automatically

4. **Usage Notes:**
   - The workflow automatically truncates large diffs to avoid API limits
   - Costs approximately $0.002-0.005 per PR analysis
   - Falls back gracefully if API fails

---

### Step 2: Reward Allocation Setup

#### Pilot Deployment (Testnet)

1. **Setup Alchemy Account:**
   - Create account at [Alchemy](https://www.alchemy.com/)
   - Create a new app on Polygon Mumbai network
   - Copy the HTTP URL

2. **Prepare Minting Wallet:**
   ```bash
   # Generate a new wallet (or use existing testnet wallet)
   # WARNING: NEVER use mainnet wallets for testing
   
   # Get Mumbai testnet MATIC from faucet
   # Visit: https://faucet.polygon.technology/
   ```

3. **Deploy or Configure OmniRewards Contract:**
   
   If you don't have a contract yet, here's a minimal ERC20 with minting:
   
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;
   
   import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
   import "@openzeppelin/contracts/access/Ownable.sol";
   
   contract OmniRewards is ERC20, Ownable {
       constructor() ERC20("OmniRewards", "OMR") {}
       
       function mint(address to, uint256 amount) public onlyOwner returns (bool) {
           _mint(to, amount);
           return true;
       }
   }
   ```
   
   Deploy to Mumbai and note the contract address.

4. **Add Secrets to Repository:**
   ```
   ALCHEMY_MUMBAI_URL: https://polygon-mumbai.g.alchemy.com/v2/YOUR-KEY
   REWARDS_PRIVATE_KEY: 0x... (private key of wallet with minting rights)
   OMNIREWARDS_CONTRACT_ADDRESS: 0x... (deployed contract address)
   ```

5. **Test the Workflow:**
   - Merge a test PR to `main`
   - Check the PR comment for reward notification
   - Verify transaction on [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
   - Check recipient balance increased

6. **Staging Mode:**
   - Without secrets configured, workflow runs in **staging mode**
   - Simulates minting without actual blockchain transactions
   - Safe for testing workflow logic

#### Production Deployment (When Ready)

⚠️ **WARNING**: Production deployment requires additional security measures:

- Use mainnet RPC endpoints (e.g., Polygon Mainnet)
- Implement multi-sig wallet for minting authority
- Add rate limiting and abuse prevention
- Conduct smart contract audit
- Set up monitoring and alerting
- Implement spending caps and budget controls

---

### Step 3: Repo-Sync Action Setup

1. **Create Personal Access Token (PAT):**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes:
     - ✅ `repo` (full control of private repositories)
   - Set expiration (recommend 90 days with calendar reminder)
   - Copy the token (`ghp_...`)

2. **Add Secrets:**
   ```
   SYNC_PAT: ghp_... (your personal access token)
   TEMPLATE_REPO_URL: chaishillomnitech1/omnitech-templates (optional, this is default)
   ```

3. **Configure Template Repository:**
   - Ensure `omnitech-templates` repository exists
   - Structure it with directories matching what you want to sync
   - Example structure:
     ```
     omnitech-templates/
     ├── .github/
     │   └── workflows/
     │       ├── pr-assistant.yml
     │       ├── reward-allocation.yml
     │       └── repo-sync.yml
     └── DEPLOYMENT.md
     ```

4. **Test Manual Sync:**
   - Go to Actions → Repo-Sync Action → Run workflow
   - Select direction: `pull` or `push`
   - Enter files to sync (e.g., `.github/workflows/`)
   - Click "Run workflow"
   - Verify changes appear in target repository

5. **Automatic Syncing:**
   - **Pull sync** runs daily at 2 AM UTC automatically
   - **Push sync** triggers when workflow files change on `main`
   - Manual dispatch available anytime

---

## Security Guardrails

### Built-in Protection Mechanisms

1. **Testnet-Only Deployment:**
   - Reward allocation hardcoded for Mumbai testnet
   - Network validation checks prevent accidental mainnet usage
   - Clear warnings in documentation

2. **Graceful Degradation:**
   - All workflows operate safely without secrets (staging mode)
   - No workflow failures due to missing configuration
   - Clear logging of staging vs. production mode

3. **Minimal Permissions:**
   - Workflows request only necessary permissions
   - Token scopes limited to specific actions
   - No write access to code or settings

4. **Rate Limiting:**
   - OpenAI API calls throttled by PR frequency
   - Diff truncation prevents excessive API usage
   - Network timeouts prevent hung jobs

5. **Audit Trail:**
   - All transactions logged with hashes
   - PR comments provide transparent reward records
   - Workflow runs archived in Actions tab

6. **Secret Hygiene:**
   - Secrets never logged or exposed
   - Environment variable isolation
   - Rotation reminders in documentation

### Best Practices

- ✅ Rotate `SYNC_PAT` every 90 days
- ✅ Monitor OpenAI API usage and costs
- ✅ Review reward transactions weekly on Mumbai PolygonScan
- ✅ Keep staging mode enabled until full testing complete
- ✅ Use dedicated testnet wallets (never reuse mainnet keys)
- ✅ Review PR assistant suggestions before merging
- ✅ Test workflows on feature branches first

---

## Troubleshooting

### AI-Powered PR Assistant

**Issue**: Bot doesn't comment on PRs

**Solutions:**
1. Check `OPENAI_API_KEY` is set correctly
2. Verify API key has available credits
3. Review workflow logs in Actions tab
4. Check PR is targeting `main` or `develop`
5. Ensure PR author is not `dependabot[bot]`

**Issue**: Comments are incomplete or generic

**Solutions:**
1. Check OpenAI API rate limits
2. Verify diff isn't too large (auto-truncates at 8000 chars)
3. Review prompt engineering in workflow file
4. Check API response in logs

---

### Reward Allocation

**Issue**: Workflow runs but no tokens minted

**Solutions:**
1. Verify all four secrets are configured correctly
2. Check wallet has MATIC for gas fees
3. Verify wallet has minting role on contract
4. Check Mumbai network status
5. Review transaction hash on PolygonScan

**Issue**: "Staging mode" message appears

**Solutions:**
1. This is normal behavior without secrets configured
2. Add all required secrets to enable live minting
3. Staging mode is safe and intentional

**Issue**: Transaction fails

**Solutions:**
1. Verify contract address is correct (42 hex chars with 0x prefix)
2. Check wallet has sufficient MATIC for gas
3. Verify RPC URL is valid and accessible
4. Check contract hasn't been paused
5. Review error message in workflow logs

---

### Repo-Sync Action

**Issue**: Pull sync fails

**Solutions:**
1. Verify `omnitech-templates` repository exists
2. Check repository is public or `SYNC_PAT` has access
3. Review `TEMPLATE_REPO_URL` format (owner/repo)
4. Check network connectivity in logs

**Issue**: Push sync doesn't create PR

**Solutions:**
1. Verify `SYNC_PAT` has `repo` scope
2. Check token hasn't expired
3. Verify template repository allows branch creation
4. Review push logs for specific errors

**Issue**: Files not syncing

**Solutions:**
1. Check file paths match exactly (case-sensitive)
2. Verify paths exist in source repository
3. Use trailing slash for directories (`.github/workflows/`)
4. Review sync logs for path resolution

---

## Monitoring & Maintenance

### Daily Tasks
- [ ] Review PR assistant comments for accuracy
- [ ] Monitor workflow run status in Actions tab

### Weekly Tasks
- [ ] Check reward allocation transactions on PolygonScan
- [ ] Review OpenAI API usage and costs
- [ ] Verify repo-sync operations completed successfully

### Monthly Tasks
- [ ] Rotate `SYNC_PAT` if approaching expiration
- [ ] Review and optimize reward multipliers
- [ ] Update workflows from template repository
- [ ] Audit security configurations

### Quarterly Tasks
- [ ] Review and update OpenAI prompts
- [ ] Consider mainnet migration planning (if applicable)
- [ ] Audit all secrets and rotate as needed
- [ ] Review workflow performance metrics

---

## Support & Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **OpenAI API Documentation**: https://platform.openai.com/docs
- **Alchemy Documentation**: https://docs.alchemy.com/
- **Polygon Mumbai Faucet**: https://faucet.polygon.technology/
- **Mumbai PolygonScan**: https://mumbai.polygonscan.com/

For issues specific to this repository, please open a GitHub issue with:
- Workflow name
- Run ID from Actions tab
- Relevant logs (with secrets redacted)
- Expected vs. actual behavior

---

## Compliance & Legal

- All smart contract interactions use testnet only
- No real monetary value transferred
- OpenAI API usage subject to OpenAI terms of service
- Ensure contributor consent for reward address collection
- Follow GitHub's terms of service for automation

---

## Version History

- **v2.0.0** (Current): Phase 2 implementation with AI assistant, rewards, and sync
- **v1.0.0**: Initial repository setup

---

**Last Updated**: December 2025  
**Maintained By**: ChaisTheGreat OmniTech Team

For questions or support, contact the repository maintainers.
