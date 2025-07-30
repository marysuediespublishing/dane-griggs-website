# Streamlined JSON Spec Development

## 🚫 NEVER RUN DEV SERVERS 🚫
Developer runs dev servers manually. NEVER run: `npm run dev`, `npm start`, `yarn dev`, `pnpm dev`

## Core Workflow
1. Read `docs/specs.md` - single file with JSON specs
2. Run `/implement-spec [ids]` for agent workflow
3. Quality checks run automatically: format → lint → test → build

## Tech Stack
- **Astro** with TypeScript
- **Tailwind CSS + shadcn/ui** for styling
- **Decap CMS** for content management
- **Jest + Playwright** with shared mocks

## Spec Format (JSON in Markdown)
```markdown
## [ ] Spec 001: Feature Name

```json
{
  "id": 1,
  "title": "Feature Name",
  "why": "User value",
  "system": {"packages": ["pkg"], "commands": ["npm install pkg"]},
  "mocks": {"feature": {"operation": {"request": {...}, "response": {...}}}},
  "apis": {"endpoints": [{"method": "POST", "path": "/api/endpoint"}]},
  "ui": {"url": "/path", "scenarios": [...], "components": ["Component"]}
}
```
```

## Code Standards
- **TypeScript** strict mode, no `any` types
- **Astro components** with proper TypeScript interfaces
- **API responses**: `{success: boolean, data?: any, error?: string}`
- **Components**: Use data-testid for E2E tests
- **Shared mocks** in `lib/test-mocks.ts` - zero drift between unit/E2E tests

## Key Commands
- `npm run dev` - Start dev server (developer only)
- `npm run build` - Build for production
- `npm run typecheck` - TypeScript validation
- `npm run test` - Jest unit tests
- `npm run test:e2e` - Playwright E2E tests
- `npm run lint` - ESLint
- `npm run format` - Prettier

## Project Structure
```
docs/specs.md          # All features (JSON specs)
lib/test-mocks.ts       # Shared mock contracts
tests/unit/             # Jest tests using shared mocks
tests/e2e/              # Playwright tests using same mocks
src/                    # Astro source files
public/admin/           # Decap CMS admin interface
logs/dev.log            # Current dev server output
```

## Spec Progress Tracking
- **Backlog**: `## [ ] Spec 001: Feature Name` - Ready to implement
- **In Progress**: `## [ ] Spec 001: Feature Name` - Currently being worked on
- **Complete**: `## [x] Spec 001: Feature Name` - All sections implemented
- **Icebox**: Move to bottom of file or separate section for future consideration

Update JSON status fields as work progresses:
- `"system": {"complete": false}` → `{"complete": true}`
- `"apis": {"complete": false}` → `{"complete": true}`
- `"ui": {"complete": false}` → `{"complete": true}`

## Agents (2-Agent Workflow)
- **@backend-agent**: APIs + mocks + unit tests (receives JSON directly)
- **@frontend-agent**: Astro components + E2E tests (receives JSON directly)
- **System setup**: Claude Code handles packages/configs directly

## Critical Testing
- **Shared mocks**: Same data for unit and E2E tests
- **Mock setup BEFORE navigation**: Always setup mocks before `page.goto()`
- **API validation**: Real APIs must match shared mock contracts exactly

## Instructions for Claude
- Use Astro component patterns with TypeScript
- Integrate with Decap CMS for content management
- Add data-testid attributes matching E2E scenarios
- Never start dev servers
- Run quality checks before completion
- **Mark specs complete: Update both JSON status AND markdown header `[ ]` → `[x]`**