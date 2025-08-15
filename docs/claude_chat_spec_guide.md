# Claude Chat Spec Writing Guide

**Copy this into new Claude Chat conversations for optimal spec creation**

## Context: JSON Spec System

I'm using a streamlined spec-driven development system where:
- **Specs are JSON objects** in markdown files (docs/specs.md)
- **Claude Code implements** using 2 agents + direct system setup
- **Implementation time**: 1-10 minutes per spec (not hours)
- **Shared mock testing** prevents test drift
- **System section** handles packages, configs, environment setup

## Spec Format

```markdown
## [ ] Spec XXX: [Feature Name]

```json
{
  "id": XXX,
  "title": "[Feature Name]", 
  "why": "[User value in 1-2 sentences]",
  "depends": [XXX],
  "notes": "[Optional: constraints, design decisions]",
  "system": {
    "complete": false,
    "packages": ["package-name"],
    "commands": ["npm install package-name"],
    "env_vars": {"NODE_ENV": "development"},
    "notes": "Special setup instructions"
  },
  "mocks": {
    "[feature]": {
      "[operation]": {"request": {"field": "realistic value"}, "response": {"success": true, "data": {...}}},
      "validation": {"[scenario]": {"request": {"field": "invalid value"}, "response": {"success": false, "error": "User-friendly message"}}}
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [{"method": "POST", "path": "/api/resource", "mock": "feature.operation"}],
    "tests": ["feature.operation success", "feature.validation.scenario error"]
  },
  "ui": {
    "complete": false,
    "url": "/path",
    "scenarios": [
      {"name": "success", "data": "feature.operation.request", "expect": "redirect /success"},
      {"name": "validation", "data": "feature.validation.scenario.request", "expect": "show error"}
    ],
    "components": ["ComponentName"]
  }
}
```
```

## Section Rules

**Must have at least one of:**
- `system` - Package installation, app setup, environment configuration
- `mocks` - Shared data contracts for APIs and testing
- `apis` - Backend endpoints and unit tests
- `ui` - Frontend components and E2E tests

**Common Patterns:**
- **System-only**: Project setup, package installation, configuration
- **UI-only**: Static components, layouts, styling
- **API-only**: Backend services, data processing  
- **Full-stack**: Complete features with frontend + backend

## System Section Guidelines

### Purpose: App Foundation, Not Implementation

**Rules**
Specs define **WHAT** to set up, not **HOW** to implement.
System gets the tools working, UI makes them look good.

**✅ Use System Section For:**
- Package installation and dependency management
- Build tool integration (Tailwind + PostCSS setup, Vite config)
- Base configuration files (tailwind.config.js with content paths)
- Environment variable configuration
- Database setup and connection strings
- External service configuration (Firebase, Stripe, etc.)
- Development tool setup (ESLint, Prettier configs)
- Zod schemas, type inference and related helper functions

**❌ Don't Use System Section For:**
- React components, routes, hooks, theme customization and styling/CSS (let frontend agent create these)
- API route implementations (let backend agent handle these)
- Utility functions or business logic
- Detailed file structures or boilerplate code
- CSS files or styling implementations

### System Section Format

```json
"system": {
  "complete": false,
  "packages": ["react-hook-form", "zod", "@types/node"],
  "commands": [
    "npm install react-hook-form zod",
    "npm install -D @types/node"
  ],
  "env_vars": {
    "DATABASE_URL": "postgresql://localhost:5432/myapp",
    "NEXT_PUBLIC_API_URL": "http://localhost:3000/api"
  },
  "notes": "Requires PostgreSQL running locally on port 5432"
}
```

### The Contract Principle

**Specs define contracts (WHAT), agents implement solutions (HOW)**

- **Mocks** = Data contracts between frontend and backend
- **APIs** = Service contracts and expected behavior  
- **UI** = User interaction contracts and expected outcomes
- **System** = Infrastructure contracts and dependencies

This separation allows agents to:
- Use latest best practices and patterns
- Adapt to framework updates and new features
- Create optimal file structures for the specific implementation
- Apply modern tooling and conventions

## Spec Size Guidelines

**Target: 1-10 minutes implementation time**

### ✅ Good Spec Sizes

**System Setup (1-3 min)**
```json
{
  "id": 1,
  "title": "Astro + Tailwind Setup",
  "why": "Team needs blog platform foundation",
  "system": {
    "complete": false,
    "commands": ["npm create astro@latest .", "npm install @astrojs/tailwind"],
    "notes": "Includes Tailwind integration and basic config"
  }
}
```

**Simple UI (2-5 min)**
```json
{
  "id": 2,
  "title": "Site Header",
  "why": "Users need navigation",
  "depends": [1],
  "ui": {
    "complete": false,
    "url": "/",
    "scenarios": [{"name": "header", "expect": "see logo and nav links"}],
    "components": ["Header"]
  }
}
```

**API Endpoint (3-7 min)**
```json
{
  "id": 3,
  "title": "User Registration API",
  "why": "Users need accounts",
  "mocks": {
    "user": {
      "create": {"request": {"name": "John Doe", "email": "john@example.com"}, "response": {"success": true, "user": {"id": 1, "name": "John Doe"}}},
      "validation": {"invalidEmail": {"request": {"email": "invalid-email"}, "response": {"success": false, "error": "Please enter a valid email address"}}}
    }
  },
  "apis": {
    "complete": false,
    "endpoints": [{"method": "POST", "path": "/api/users", "mock": "user.create"}],
    "tests": ["user.create success", "user.validation.invalidEmail error"]
  }
}
```

**Full-Stack Feature (5-10 min)**
```json
{
  "id": 4,
  "title": "Contact Form",
  "why": "Visitors need to reach author",
  "system": {"complete": false, "packages": ["react-hook-form", "zod"]},
  "mocks": {"contact": {"send": {"request": {"name": "John", "email": "john@example.com", "message": "Hello"}, "response": {"success": true, "message": "Message sent successfully"}}}},
  "apis": {"complete": false, "endpoints": [{"method": "POST", "path": "/api/contact", "mock": "contact.send"}], "tests": ["contact.send success"]},
  "ui": {"complete": false, "url": "/contact", "scenarios": [{"name": "submit", "data": "contact.send.request", "expect": "show success message"}], "components": ["ContactForm"]}
}
```

### ❌ Too Large - Split Into Multiple Specs

- 5+ UI components in one spec
- Complex multi-step workflows  
- Multiple unrelated features
- Anything taking 15+ minutes to implement

## Mock Data Best Practices

### ✅ Realistic Data
```json
"mocks": {
  "user": {
    "create": {"request": {"name": "John Doe", "email": "john@example.com", "phone": "+1-555-123-4567"}, "response": {"success": true, "user": {"id": 1, "name": "John Doe", "createdAt": "2025-01-15T10:30:00Z"}}}
  }
}
```

### ✅ Specific Error Messages
```json
"mocks": {
  "user": {
    "validation": {"invalidEmail": {"request": {"email": "invalid-email"}, "response": {"success": false, "error": "Please enter a valid email address"}}}
  }
}
```

### ✅ Complete Response Structure
```json
"mocks": {
  "contact": {
    "send": {"request": {"name": "John", "message": "Hello"}, "response": {"success": true, "data": {"id": 1, "sentAt": "2025-01-15T10:30:00Z"}}}
  }
}
```

## UI Scenario Best Practices

### ✅ Specific Expectations
```json
"scenarios": [
  {"name": "success", "expect": "redirect to /dashboard with welcome message"},
  {"name": "validation", "expect": "show 'Email is required' error below email field"}
]
```

### ✅ Reference Mock Data
```json
"scenarios": [
  {"name": "submit", "data": "contact.send.request", "expect": "show success message"}
]
```

### ✅ Clear Actions
```json
"scenarios": [
  {"name": "mobile-menu", "action": "click hamburger button", "expect": "navigation menu slides in"}
]
```

## Dependency Guidelines

### ✅ Use Dependencies For
- System setup before features that need packages
- Authentication before user-specific features
- Shared components before pages that use them

### ✅ Example Dependency Chain
```json
// Spec 1: Foundation
{"id": 1, "system": {"commands": ["npm create astro@latest ."]}}

// Spec 2: Auth (needs foundation)  
{"id": 2, "depends": [1], "apis": {"endpoints": ["/api/auth/login"]}}

// Spec 3: Dashboard (needs auth)
{"id": 3, "depends": [2], "ui": {"url": "/dashboard"}}
```

### ❌ Avoid Circular Dependencies
```json
// Bad: Spec 5 depends on 6, but 6 depends on 5
{"id": 5, "depends": [6]}
{"id": 6, "depends": [5]}
```

## Writing Prompts That Work

### ✅ Good Prompts
- "Create specs for a blog comment system with moderation"
- "Break down user authentication into 2-3 small specs"  
- "Design API specs for a contact form with email validation"
- "Plan responsive header component with mobile menu"

### ✅ Provide Context
- "This is for an author website using Astro + Tailwind"
- "Users should have a professional, clean experience"
- "Focus on mobile-first responsive design"
- "Keep specs small - 5 minutes implementation each"

### ✅ Specify Constraints  
- "Dark theme only, no toggle needed"
- "Use shadcn/ui components for consistency"
- "APIs should be RESTful with standard response format"
- "Include both success and validation error scenarios"

## Common Requests

**"Make specs for [feature]"** → I'll create properly sized JSON specs with realistic mock data

**"Break this into smaller specs"** → I'll split large features into 2-5 minute implementation chunks

**"Add system setup for [packages]"** → I'll create system section with installation and configuration

**"Design API contracts for [feature]"** → I'll create mocks + apis sections with proper validation

**"Plan UI components for [feature]"** → I'll create ui section with scenarios and component breakdown

## Key Reminders

- **Small specs** (1-10 minutes) are better than large ones
- **Realistic mock data** makes implementation smoother
- **Clear dependencies** enable parallel development
- **Specific scenarios** reduce implementation ambiguity
- **System sections** handle environment setup automatically
- **Contracts over implementation** - define WHAT, let agents determine HOW

Ready to create some specs! What feature should we design?