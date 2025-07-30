# Implement Spec: $ARGUMENTS

Execute agent workflow for JSON spec(s) $ARGUMENTS.

**Usage Examples:**
- `/implement-spec 015` - Implement spec 015
- `/implement-spec 015-018` - Implement specs 015, 016, 017, 018
- `/implement-spec 015,017,020` - Implement specific specs 015, 017, and 020

## Implementation Process

### Step 1: Parse and Validate Specs

- **Parse spec numbers** from $ARGUMENTS (single, range, or list)
- **Read specs file** (`docs/specs.md`) and extract JSON spec objects
- **Validate each spec** using Zod schemas from `.claude/schemas/spec-schemas.ts`
- **Check completion status** - skip specs where all sections are complete
- **Verify dependencies** - ensure required specs are completed first

### Step 2: Smart Agent Workflow (Per Spec)

For each incomplete spec:

#### Phase 1: System Setup (if needed)

When spec has `system` section with `complete: false`, **Claude Code directly**:

1. **Install packages** - Run `npm install` commands from `system.packages`
2. **Execute commands** - Run setup commands from `system.commands`
3. **Create files** - Write configuration files from `system.files`
4. **Set environment variables** - Add variables from `system.env_vars` to .env files
5. **Update completion** - Set `system.complete: true` in specs.md

#### Phase 2: Backend Implementation (if needed)

Use @backend-agent when spec has `apis` section with `complete: false`:

1. **Pass spec JSON directly** to backend-agent with exact API requirements
2. **Agent implements**:
   - Create/update shared mocks in `lib/test-mocks.ts`
   - Build API endpoints matching `apis.endpoints`
   - Write unit tests for `apis.tests` scenarios
3. **Update completion** - Set `apis.complete: true` in specs.md
4. **Verify tests pass** - Run `npm run test`

#### Phase 3: Frontend Implementation (if needed)

Use @frontend-agent when spec has `ui` section with `complete: false`:

1. **Pass spec JSON directly** to frontend-agent with exact UI requirements
2. **Agent implements**:
   - Build UI components listed in `ui.components`
   - Implement page at `ui.url`
   - Create E2E tests for `ui.scenarios`
   - Update APIMockManager for new mocks
3. **Update completion** - Set `ui.complete: true` in specs.md
4. **Verify tests pass** - Run `npm run test:e2e`

#### Phase 4: Quality Verification & Commit

After all implementation phases complete:

1. **Run comprehensive checks**
   ```bash
   # Execute all quality verification
   /run-all-checks
   ```

2. **Auto-fix any issues found**
   ```bash
   # If any checks fail, attempt automatic fixes
   /auto-fix-issues
   
   # Re-run checks to verify fixes
   /run-all-checks
   ```

3. **Final steps**
   - **Commit changes** with descriptive message including spec ID and title
   - **Report completion** with summary of implemented sections and quality status

## Smart Workflow Logic

### Spec Analysis
```typescript
// Determine what work is needed
const needsSystem = spec.system && !spec.system.complete;
const needsBackend = spec.apis && !spec.apis.complete;
const needsFrontend = spec.ui && !spec.ui.complete;
const isComplete = !needsSystem && !needsBackend && !needsFrontend;

if (isComplete) {
  console.log(`✅ Spec ${spec.id} already complete`);
  continue;
}
```

### Execution Order
1. **System setup first** - Install packages and create config files
2. **Backend second** - APIs can use newly installed packages
3. **Frontend third** - UI can integrate with completed APIs
4. **Testing throughout** - Verify each phase before proceeding

### Agent Data Passing
Instead of file extraction, pass JSON data directly to agents:

```typescript
// Backend agent receives:
{
  id: 15,
  title: "User Registration", 
  apis: {
    complete: false,
    endpoints: [{ method: "POST", path: "/api/users", mock: "user.create" }],
    tests: ["user.create success", "user.validation error"]
  },
  mocks: {
    user: {
      create: { request: {...}, response: {...} },
      validation: { invalidEmail: { request: {...}, response: {...} } }
    }
  }
}

// Frontend agent receives:
{
  id: 15,
  title: "User Registration",
  ui: {
    complete: false,
    url: "/register", 
    scenarios: [
      { name: "success", data: "user.create.request", expect: "redirect /dashboard" },
      { name: "validation", data: "user.validation.invalidEmail.request", expect: "show error" }
    ],
    components: ["RegistrationForm"]
  },
  mocks: { /* same mock data for E2E testing */ }
}
```

### Dependency Validation
```typescript
// Check dependencies before starting
if (spec.depends) {
  for (const depId of spec.depends) {
    const depSpec = getSpecById(depId);
    if (!isSpecComplete(depSpec)) {
      throw new Error(`Spec ${spec.id} depends on incomplete spec ${depId}`);
    }
  }
}
```

## Error Handling

### Validation Errors
- **Invalid JSON**: Report syntax errors with line numbers
- **Schema violations**: Show specific validation failures using Zod
- **Missing dependencies**: List incomplete prerequisite specs

### Implementation Errors
- **System setup failures**: Package installation errors, file creation issues
- **Test failures**: Show which tests failed and why
- **Type errors**: Report TypeScript compilation issues
- **Agent errors**: Capture and report agent-specific failures

### Recovery Strategies
- **Partial completion**: Mark completed sections even if others fail
- **Continue on error**: Process remaining specs even if one fails
- **Clear error reporting**: Show exactly what failed and how to fix

## Benefits of This Approach

### Speed
- **System setup automation** - No manual package installation
- **2-agent workflow** instead of 6 agents
- **Direct data passing** - No file extraction overhead
- **Smart skipping** - Only run agents for incomplete sections

### Reliability
- **Dependency checking** prevents integration issues
- **Shared mock contracts** prevent test drift
- **Validation** catches spec errors early
- **Granular completion** tracks progress precisely

### Maintainability
- **JSON specs** are structured and tool-friendly
- **Simple agent instructions** - just implement what's passed
- **Clear completion tracking** shows project status
- **System section** handles environment setup automatically

## Quality Verification

After implementation, **automatically run quality checks**:

```bash
# Comprehensive verification (runs automatically)
/run-all-checks

# If issues found, auto-fix them (runs automatically)
/auto-fix-issues

# Re-verify after fixes (runs automatically)  
/run-all-checks
```

**Final verification ensures:**
- TypeScript compiles without errors
- All unit tests pass
- All E2E tests pass  
- Code style is consistent
- Build succeeds

**Only commit when all checks pass** ✅

## When to Stop and Ask

- **Spec validation fails** - JSON syntax or schema errors
- **Dependencies unclear** - circular or missing dependencies
- **System setup fails** - package installation or file creation errors
- **Agent implementation fails** - persistent errors across multiple attempts
- **Integration conflicts** - new code breaks existing functionality

This streamlined approach handles everything from project setup to feature implementation in one unified workflow, maintaining quality while dramatically reducing implementation time.