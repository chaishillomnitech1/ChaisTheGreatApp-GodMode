# Change Log

## [Unreleased]

### Phase 2 - Enhanced Automation (December 2025)

#### New Workflows
- **AI-Powered PR Assistant**: Auto-generates PR summaries, labels, and changelog suggestions using OpenAI GPT-3.5
  - Analyzes PR diffs and provides intelligent summaries
  - Automatically suggests and applies appropriate labels
  - Generates changelog entries for merged PRs
  - Requires `OPENAI_API_KEY` secret configuration

- **Reward Allocation for Merged PRs**: Integrates with OmniRewards testnet contract to mint tokens
  - Calculates reward amounts based on PR size (1x-2x multipliers)
  - Mints tokens on Polygon Mumbai testnet via Alchemy
  - Posts transaction details and reward notifications
  - Includes staging mode for safe testing without secrets
  - Requires `ALCHEMY_MUMBAI_URL`, `REWARDS_PRIVATE_KEY`, and `OMNIREWARDS_CONTRACT_ADDRESS` secrets

- **Repo-Sync Action**: Enables bidirectional synchronization with omnitech-templates repository
  - Pull sync: Fetches workflow updates from template repository (daily automated)
  - Push sync: Shares local workflow improvements back to templates
  - Manual dispatch with configurable file selection
  - Requires `SYNC_PAT` and optional `TEMPLATE_REPO_URL` secrets

#### Documentation
- Added comprehensive `DEPLOYMENT.md` with setup instructions
  - Complete secret configuration guide
  - Step-by-step deployment procedures
  - Security guardrails and best practices
  - Troubleshooting section
  - Monitoring and maintenance schedules

#### Security Features
- Testnet-only deployment for reward allocation (Mumbai)
- Graceful degradation to staging mode when secrets not configured
- Network validation checks and transaction verification
- Minimal permission scopes for all workflows
- Comprehensive audit trails and logging

### Phase 1

#### Updates
- Updated README.md with ScrollVerse principles.
- Updated ROADMAP.md with ScrollVerse principles.

#### CI/CD Workflows
- Implemented CI/CD workflows for health analysis.

#### Security Review
- Reviewed encryption practices.

#### Enhancements
- Aligned enhancements with ScrollVerse objectives.

#### Modular Design
- Ensured modularity and adaptability across codebases.