# Team Training: Streamlined JSON Spec System

## What This System Does

**In 30 seconds**: You write structured JSON specs in markdown files. Claude Code implements them automatically using 2 specialized agents plus direct system setup. Features are built fast, tested thoroughly, and work reliably.

**Key Innovation**: Shared mock contracts keep all tests synchronized while system section handles full project setup automatically.

## The New Specs Format

### Single JSON Object Per Spec

```markdown
## [ ] Spec 001: Astro Blog Platform Setup

```json
{
  "id": 1,
  "title": "Astro Blog Platform Setup",
  "why": "Team needs modern blog platform foundation",
  "system": {
    "complete": false,
    "commands": [
      "npm create astro@latest . -- --template blog --typescript",
      "npm install @decapcms/core @astrojs/tailwind"
    ],
    "files": {
      "public/admin/config.yml": "backend:\n  name: git-gateway\ncollections:\n  - name: blog",
      "astro.config.mjs": "import tailwind from '@astrojs/tailwind';\nexport default { integrations: [tailwind()] };"
    }
  }
}
```
```

### Benefits of JSON Format

- **Tool Validation** - Zod schemas catch errors early
- **Agent Instructions** - Exact implementation requirements passed directly
- **Smart Workflow** - Skip completed sections automatically
- **System Setup** - Handle packages, configs, and environment automatically
- **Shared References** - Mocks used by both backend and frontend
- **Progress Tracking** - Granular completion status

## Writing Effective JSON Specs

### Required Fields

**Always include:**
```json
{
  "id": 1,
  "title": "Clear, descriptive feature name",
  "why": "User value and business justification"
}
```

**At least one of:**
- `system` - Package installation, file creation, environment setup
- `mocks` - Shared data contracts
- `apis` - Backend implementation  
- `ui` - Frontend implementation

### Optional Fields

```json
{
  "depends": [1, 2], // Prerequisite spec IDs
  "notes": "Implementation constraints or future considerations"
}
```

### Section Patterns

#### System Setup Spec
```json
{
  "id": 1,
  "title": "Project Foundation",
  "why": "Team needs development environment",
  "system": {
    "complete": false,
    "packages": ["astro", "@decapcms/core", "@astrojs/tailwind"],
    "commands": [
      "npm create astro@latest .",
      "npx astro add tailwind"
    ],
    "files": {
      "astro.config.mjs": "export default { integrations: [...] }",
      ".env.example": "PUBLIC_SITE_URL=http://localhost:3000"
    }
  }
}
```

#### Frontend-Only Spec
```json
{
  "id": 2,
  "title": "Site Header",
  "why": "Users need navigation and branding",
  "depends": [1],
  "ui": {
    "complete": false,
    "url": "/",
    "scenarios": [
      { "name": "header", "expect": "see logo, navigation, dark theme styling" }
    ],
    "components": ["Header", "Navigation"]
  }
}
```

#### Full-Stack Spec
```json
{
  "id": 3,
  "title": "Blog Comments",
  "why": "Readers need to engage with content",
  "depends": [1],
  "system": {
    "complete": false,
    "packages": ["@supabase/supabase-js"]
  },
  "mocks": {
    "comments": {
      "create": {
        "request": { "content": "Great post!", "postId": 1, "author": "John" },
        "response": { "success": true, "comment": { "id": 1, "content": "Great post!" } }
      }
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [{ "method": "POST", "path": "/api/comments", "mock": "comments.create" }],
    "tests": ["comments.create success"]
  },
  "ui": {
    "complete": false,
    "url": "/blog/[slug]",
    "scenarios": [
      { "name": "add-comment", "data": "comments.create.request", "expect": "comment appears in list" }
    ],
    "components": ["CommentForm", "CommentList"]
  }
}
```

## The Streamlined Workflow

### 3-Phase Process

1. **System Setup** (Claude Code directly)
   - Installs packages from `system.packages`
   - Runs commands from `system.commands`  
   - Creates files from `system.files`
   - Updates `system.complete: true`

2. **@backend-agent** (if `apis.complete: false`)
   - Creates shared mocks in `lib/test-mocks.ts`
   - Implements API endpoints
   - Writes unit tests
   - Updates `apis.complete: true`

3. **@frontend-agent** (if `ui.complete: false`)
   - Builds UI components
   - Implements pages with proper styling
   - Creates E2E tests using shared mocks
   - Updates `ui.complete: true`

### Smart Execution

```bash
/implement-spec 001-003
```

**Automatically:**
- Validates JSON specs with Zod schemas
- Checks dependencies are completed
- Skips specs where all sections are complete
- Runs system setup + appropriate agents per spec
- Passes JSON data directly to agents (no file extraction)
- Updates completion status as work finishes

## Commands You'll Use

### Primary Development

```bash
/implement-spec 001        # Single spec
/implement-spec 001-005    # Range of specs  
/implement-spec 001,003,005 # Specific specs
```

### Quality Assurance

```bash
/run-all-checks           # Full quality verification
/auto-fix-issues          # Resolve common problems automatically
```

## Quality Benefits

### Shared Mock Testing

**One mock definition, zero test drift:**

```typescript
// lib/test-mocks.ts (created by backend agent)
export const apiMocks = {
  comments: {
    create: {
      request: { content: "Great post!", postId: 1, author: "John" },
      response: { success: true, comment: { id: 1, content: "Great post!" } }
    }
  }
};

// Unit tests use these mocks
expect(result).toEqual(apiMocks.comments.create.response);

// E2E tests use same mocks (fast, reliable)
await mockManager.setupMock('comments.create', apiMocks.comments.create.response);
```

### System Setup Automation

No more manual environment setup:

```json
{
  "system": {
    "packages": ["@supabase/supabase-js", "react-hook-form"],
    "commands": ["npx supabase init"],
    "files": {
      "lib/supabase.ts": "export const supabase = createClient(...)",
      ".env.example": "SUPABASE_URL=your_url"
    }
  }
}
```

Claude Code automatically handles all installation and configuration.

### Auto-Fix Intelligence

The system can automatically resolve:
- **Code formatting** with Prettier
- **Lint issues** with ESLint auto-fix
- **Type mismatches** using spec mock contracts
- **Test drift** by updating expectations to match mocks
- **Missing data-testid** attributes for E2E testing

## Spec Size Guidelines

### Target: 1-10 minutes implementation time

- **System setup (1-3 minutes)**: Package installation, config creation
- **Small feature (2-5 minutes)**: Simple components or single API endpoints
- **Medium feature (5-10 minutes)**: Full-stack CRUD operations with testing
- **Large feature (10+ minutes)**: Consider splitting into multiple specs

### Good Spec Examples

#### System Setup
```json
{
  "id": 1,
  "title": "Astro + Tailwind + CMS Setup",
  "why": "Team needs blog platform foundation",
  "system": {
    "complete": false,
    "commands": ["npm create astro@latest .", "npm install @decapcms/core"],
    "files": { "astro.config.mjs": "..." }
  }
}
```

#### Simple Feature
```json
{
  "id": 2,
  "title": "Dark Theme Header",
  "why": "Users need consistent navigation",
  "depends": [1],
  "ui": {
    "complete": false,
    "url": "/",
    "scenarios": [{ "name": "header", "expect": "dark theme navigation with logo" }],
    "components": ["Header"]
  }
}
```

## Collaboration Workflow

### Spec Writing (You + Claude Chat)

1. **Design session** - Collaborate on feature requirements
2. **Create JSON spec** - Structure with realistic mock data and system needs
3. **Validate spec** - Check with Zod schemas
4. **Add to specs.md** - Append to project specs file

### Implementation (Claude Code)

1. **Run implementation** - `/implement-spec [ids]`
2. **System setup** - Packages installed, configs created automatically
3. **Agent execution** - Backend and/or frontend agents implement features
4. **Quality check** - `/run-all-checks`
5. **Auto-fix issues** - `/auto-fix-issues` if needed
6. **Final verification** - `/run-all-checks` again

### Review Process

```bash
# Check what's complete
grep -A 1 '"complete":' docs/specs.md

# Verify implementation quality
/run-all-checks

# Test features manually in browser
npm run dev
```

## Migration from Old System

### Converting Existing Specs

**Old Format:**
```markdown
## [ ] Spec 015: User Registration

- User fills form with name and email, submits successfully
- User sees validation error for invalid email format
```

**New Format:**
```json
{
  "id": 15,
  "title": "User Registration",
  "why": "Users need accounts for personalized features",
  "mocks": {
    "user": {
      "create": {
        "request": { "name": "John Doe", "email": "john@example.com" },
        "response": { "success": true, "user": { "id": 1, "name": "John Doe" } }
      },
      "validation": {
        "invalidEmail": {
          "request": { "name": "John Doe", "email": "invalid-email" },
          "response": { "success": false, "error": "Please enter a valid email address" }
        }
      }
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [{ "method": "POST", "path": "/api/users", "mock": "user.create" }],
    "tests": ["user.create success", "user.validation.invalidEmail error"]
  },
  "ui": {
    "complete": false,
    "url": "/register",
    "scenarios": [
      { "name": "success", "data": "user.create.request", "expect": "redirect /dashboard" },
      { "name": "validation", "data": "user.validation.invalidEmail.request", "expect": "show error" }
    ],
    "components": ["UserRegistrationForm"]
  }
}
```

## Expected Results

### Development Speed
- **5-10x faster** implementation (minutes vs hours)
- **Automatic system setup** - no manual package installation
- **Smart skipping** of completed work
- **Direct data passing** to agents eliminates file extraction overhead

### Code Quality
- **Zero mock drift** between unit and E2E tests
- **Consistent patterns** across all features
- **Auto-fix capabilities** for common issues
- **Comprehensive testing** built into every feature

### Team Productivity
- **Clear handoffs** between planning and implementation
- **Structured specs** reduce ambiguity
- **Progress tracking** shows project status
- **System automation** handles environment setup

## Advanced Patterns

### Multi-Package System Setup
```json
{
  "system": {
    "complete": false,
    "packages": ["@supabase/supabase-js", "@stripe/stripe-js", "react-hook-form"],
    "commands": [
      "npx supabase init",
      "npx stripe install"
    ],
    "files": {
      "lib/supabase.ts": "export const supabase = createClient(...)",
      "lib/stripe.ts": "export const stripe = loadStripe(...)",
      ".env.example": "SUPABASE_URL=\nSTRIPE_PUBLISHABLE_KEY="
    },
    "env_vars": {
      "NODE_ENV": "development"
    }
  }
}
```

### Progressive Enhancement Specs
```json
{
  "id": 5,
  "title": "Enhanced Blog Comments",
  "why": "Users want rich comment interactions",
  "depends": [3], // Basic comments from previous spec
  "system": {
    "complete": false,
    "packages": ["react-markdown", "emoji-picker-react"]
  },
  "ui": {
    "complete": false,
    "url": "/blog/[slug]",
    "scenarios": [
      { "name": "rich-editor", "expect": "see markdown editor with emoji picker" },
      { "name": "comment-reactions", "expect": "add emoji reactions to comments" }
    ],
    "components": ["MarkdownEditor", "EmojiPicker", "CommentReactions"]
  }
}
```

### Configuration-Only Specs
```json
{
  "id": 10,
  "title": "Production Deployment Config", 
  "why": "Team needs reliable deployment pipeline",
  "system": {
    "complete": false,
    "files": {
      "vercel.json": "{ \"framework\": \"astro\", \"buildCommand\": \"npm run build\" }",
      ".github/workflows/deploy.yml": "name: Deploy\n...",
      "Dockerfile": "FROM node:18-alpine\n..."
    }
  }
}
```

## Troubleshooting

### Spec Implementation Issues

1. **System setup fails**
   - Check package availability: `npm view [package-name]`
   - Verify Node version compatibility
   - Review command output in logs

2. **Agent errors**
   - Validate JSON spec with Zod schema
   - Check dependency completion status
   - Review mock data structure for consistency

3. **Tests failing**
   - Run individual test suites: `npm run test [spec-pattern]`
   - Check mock contracts match API implementation
   - Verify E2E test selectors match components

### Quality Issues

```bash
# Comprehensive check
/run-all-checks

# Focus on specific problems
npm run typecheck     # Type errors
npm run lint          # Code style
npm run test:e2e      # E2E test failures

# Automatic fixes
/auto-fix-issues
```

## Best Practices

### Spec Design
- **Start with system setup** - Foundation specs that other features depend on
- **Keep specs focused** - Single feature or logical grouping
- **Use realistic mock data** - Actual formats, proper validation scenarios
- **Design for mobile-first** - Ensure responsive design requirements

### Dependency Management
- **Linear dependencies** - Avoid circular references between specs
- **Logical grouping** - Related features should have clear dependency chains
- **System dependencies** - Ensure packages are installed before features that need them

### Testing Strategy
- **Happy path + validation** - Core functionality + key error scenarios
- **Shared mock consistency** - Same data across unit and E2E tests
- **Component isolation** - Test components independently when possible

This system transforms feature development from hours to minutes while maintaining comprehensive testing and high code quality. The addition of system automation makes it suitable for complete project setup through feature completion in one unified workflow.# Team Training: Streamlined JSON Spec System

## What Changed (v2.0)

**From:** Bullet point specs with 6-agent workflow taking hours
**To:** JSON specs with 2-agent workflow taking minutes

### Key Improvements

1. **JSON Spec Format** - Structured, validated, tool-friendly
2. **2-Agent Workflow** - Backend + Frontend agents only
3. **Shared Mock Contracts** - Prevents test drift, enables fast E2E testing
4. **Smart Completion Tracking** - Granular progress per section
5. **Auto-Fix Capabilities** - Resolve quality issues automatically

## The New Specs Format

### Single JSON Object Per Spec

```markdown
## Spec 015: User Registration

```json
{
  "title": "User Registration",
  "why": "Users need accounts to access personalized features",
  "mocks": {
    "user": {
      "create": {
        "request": { "name": "John Doe", "email": "john@example.com", "password": "password123" },
        "response": { "success": true, "user": { "id": 1, "name": "John Doe", "email": "john@example.com" } }
      },
      "validation": {
        "invalidEmail": {
          "request": { "name": "John Doe", "email": "invalid-email", "password": "password123" },
          "response": { "success": false, "error": "Please enter a valid email address" }
        }
      }
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [
      { "method": "POST", "path": "/api/users", "mock": "user.create" }
    ],
    "tests": ["user.create success", "user.validation.invalidEmail error"]
  },
  "ui": {
    "complete": false,
    "url": "/register",
    "scenarios": [
      { "name": "success", "data": "user.create.request", "expect": "redirect /dashboard" },
      { "name": "validation", "data": "user.validation.invalidEmail.request", "expect": "show error" }
    ],
    "components": ["UserRegistrationForm"]
  }
}
```
```

### Benefits of JSON Format

- **Tool Validation** - Zod schemas catch errors early
- **Agent Instructions** - Exact implementation requirements
- **Smart Workflow** - Skip completed sections automatically
- **Shared References** - Mocks used by both backend and frontend
- **Progress Tracking** - Granular completion status

## Writing Effective JSON Specs

### Required Sections

**Always include:**
```json
{
  "title": "Clear, descriptive feature name",
  "why": "User value and business justification"
}
```

**At least one of:**
- `mocks` - Shared data contracts
- `apis` - Backend implementation  
- `ui` - Frontend implementation

### Optional Sections

```json
{
  "depends": [012, 015], // Prerequisite specs
  "notes": "Implementation constraints or future considerations"
}
```

### Section Patterns

#### Frontend-Only Spec
```json
{
  "title": "Dashboard Layout",
  "why": "Users need organized account overview",
  "ui": {
    "complete": false,
    "url": "/dashboard",
    "scenarios": [
      { "name": "layout", "expect": "see header, sidebar, main content" }
    ],
    "components": ["DashboardLayout"]
  }
}
```

#### API-Only Spec
```json
{
  "title": "Data Export API",
  "why": "Users need to download account data",
  "mocks": {
    "export": {
      "generate": {
        "request": { "format": "pdf" },
        "response": { "success": true, "downloadUrl": "https://..." }
      }
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [{ "method": "POST", "path": "/api/export", "mock": "export.generate" }],
    "tests": ["export.generate success"]
  }
}
```

#### Full-Stack Spec
Include all three sections: `mocks`, `apis`, and `ui`

## The Streamlined Workflow

### 2-Agent Process

1. **@backend-agent** (if `apis.complete: false`)
   - Creates shared mocks in `lib/test-mocks.ts`
   - Implements API endpoints
   - Writes unit tests
   - Updates `apis.complete: true`

2. **@frontend-agent** (if `ui.complete: false`)
   - Builds UI components
   - Implements page at specified URL
   - Creates E2E tests using shared mocks
   - Updates `ui.complete: true`

### Smart Execution

```bash
/implement-spec 015-018
```

**Automatically:**
- Validates JSON specs with Zod schemas
- Checks dependencies are completed
- Skips specs where all sections are complete
- Runs only needed agents per spec
- Updates completion status as work finishes

## Commands You'll Use

### Primary Development

```bash
/implement-spec 015        # Single spec
/implement-spec 015-020    # Range of specs  
/implement-spec 015,017,019 # Specific specs
```

### Quality Assurance

```bash
/run-all-checks           # Full quality verification
/auto-fix-issues          # Resolve common problems automatically
```

## Quality Benefits

### Shared Mock Testing

**One mock definition, zero test drift:**

```typescript
// lib/test-mocks.ts (created by backend agent)
export const apiMocks = {
  user: {
    create: {
      request: { name: "John Doe", email: "john@example.com" },
      response: { success: true, user: { id: 1, name: "John Doe" } }
    }
  }
};

// Unit tests use these mocks
expect(result).toEqual(apiMocks.user.create.response);

// E2E tests use same mocks (fast, reliable)
await mockManager.setupMock('user.create', apiMocks.user.create.response);
```

### Auto-Fix Intelligence

The system can automatically resolve:
- **Code formatting** with Prettier
- **Lint issues** with ESLint auto-fix
- **Type mismatches** using spec mock contracts
- **Test drift** by updating expectations to match mocks
- **Missing data-testid** attributes for E2E testing

## Spec Size Guidelines

### Target: 2-10 minutes implementation time

- **Tiny (1-2 minutes)**: UI-only layout components
- **Small (2-5 minutes)**: Simple forms or single API endpoints
- **Medium (5-10 minutes)**: Full-stack CRUD operations
- **Large (10+ minutes)**: Consider splitting into multiple specs

### Good Spec Examples

#### Tiny Spec
```json
{
  "title": "Header Navigation",
  "why": "Users need to navigate between pages",
  "ui": {
    "complete": false,
    "url": "/",
    "scenarios": [{ "name": "navigation", "expect": "see logo, menu, user avatar" }],
    "components": ["Header"]
  }
}
```

#### Small Spec
```json
{
  "title": "User Logout",
  "why": "Users need to securely end their session",
  "apis": {
    "complete": false,
    "endpoints": [{ "method": "POST", "path": "/api/auth/logout", "mock": "auth.logout" }],
    "tests": ["auth.logout success"]
  },
  "ui": {
    "complete": false,
    "url": "/dashboard",
    "scenarios": [{ "name": "logout", "action": "click logout button", "expect": "redirect /" }],
    "components": ["LogoutButton"]
  }
}
```

## Collaboration Workflow

### Spec Writing (You + Claude Chat)

1. **Design session** - Collaborate on feature requirements
2. **Create JSON spec** - Structure with realistic mock data  
3. **Validate spec** - Check with Zod schemas
4. **Add to specs.md** - Append to project specs file

### Implementation (Claude Code)

1. **Run implementation** - `/implement-spec [numbers]`
2. **Quality check** - `/run-all-checks`
3. **Auto-fix issues** - `/auto-fix-issues` if needed
4. **Final verification** - `/run-all-checks` again

### Review Process

```bash
# Check what's complete
grep -A 1 '"complete":' docs/specs.md

# Verify implementation quality
/run-all-checks

# Test feature manually in browser
npm run dev
```

## Migration from Old System

### Converting Existing Specs

**Old Format:**
```markdown
## ☐ Spec 015: User Registration

- User fills form with name and email, submits successfully
- User sees validation error for invalid email format
```

**New Format:**
```json
{
  "title": "User Registration",
  "why": "Users need accounts for personalized features",
  "mocks": {
    "user": {
      "create": {
        "request": { "name": "John Doe", "email": "john@example.com" },
        "response": { "success": true, "user": { "id": 1, "name": "John Doe" } }
      },
      "validation": {
        "invalidEmail": {
          "request": { "name": "John Doe", "email": "invalid-email" },
          "response": { "success": false, "error": "Please enter a valid email address" }
        }
      }
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [{ "method": "POST", "path": "/api/users", "mock": "user.create" }],
    "tests": ["user.create success", "user.validation.invalidEmail error"]
  },
  "ui": {
    "complete": false,
    "url": "/register",
    "scenarios": [
      { "name": "success", "data": "user.create.request", "expect": "redirect /dashboard" },
      { "name": "validation", "data": "user.validation.invalidEmail.request", "expect": "show error" }
    ],
    "components": ["UserRegistrationForm"]
  }
}
```

## Expected Results

### Development Speed
- **5-10x faster** implementation (minutes vs hours)
- **Immediate feedback** from quality checks
- **Smart skipping** of completed work

### Code Quality
- **Zero mock drift** between unit and E2E tests
- **Consistent patterns** across all features
- **Auto-fix capabilities** for common issues

### Team Productivity
- **Clear handoffs** between planning and implementation
- **Structured specs** reduce ambiguity
- **Progress tracking** shows project status

This system transforms feature development from hours to minutes while maintaining comprehensive testing and high code quality. Focus on **what** users need in JSON specs, and let the streamlined agents handle **how** to build it efficiently.