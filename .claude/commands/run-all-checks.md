# Run All Checks

Execute comprehensive quality checks across the entire codebase.

## What This Command Does

Runs all quality verification tools to ensure code is production-ready:

1. **Code Formatting** - Prettier formatting consistency
2. **Code Linting** - ESLint rules compliance  
3. **Type Checking** - TypeScript compilation without errors
4. **Unit Tests** - Jest test suite execution
5. **E2E Tests** - Playwright end-to-end test execution
6. **Build Verification** - Next.js/Astro production build success

## Execution Sequence

### Phase 1: Static Analysis
```bash
# Format check (don't auto-fix, just report)
npx prettier --check "**/*.{ts,tsx,js,jsx,json,md,astro}"

# Lint check  
npm run lint

# Type check
npm run typecheck
```

### Phase 2: Testing
```bash
# Unit tests
npm run test

# E2E tests (if available)  
npm run test:e2e
```

### Phase 3: Build Verification
```bash
# Production build
npm run build
```

## Output Format

### Success Case
```
✅ All Checks Passed

📊 Results Summary:
  ✅ Formatting: All files properly formatted
  ✅ Linting: No ESLint errors or warnings
  ✅ Types: TypeScript compilation successful
  ✅ Unit Tests: 24 tests passed, 0 failed
  ✅ E2E Tests: 12 scenarios passed, 0 failed  
  ✅ Build: Production build successful

🚀 Codebase is production-ready!
```

### Failure Case
```
❌ Quality Issues Found

📊 Results Summary:
  ✅ Formatting: All files properly formatted
  ❌ Linting: 3 errors, 7 warnings
  ❌ Types: 2 TypeScript errors
  ✅ Unit Tests: 24 tests passed, 0 failed
  ❌ E2E Tests: 10 passed, 2 failed
  ⏹️  Build: Skipped due to TypeScript errors

🔧 Run /auto-fix-issues to attempt automatic fixes
```

## Detailed Error Reporting

When issues are found, provide specific details:

### Linting Errors
```
ESLint Issues:
  src/components/UserForm.tsx:23:15
    ❌ 'user' is assigned a value but never used (no-unused-vars)
  
  src/pages/dashboard.tsx:45:10  
    ⚠️  Missing dependency in useEffect hook (react-hooks/exhaustive-deps)
```

### TypeScript Errors
```
TypeScript Errors:
  src/lib/api.ts:12:3
    ❌ Property 'email' does not exist on type 'User'
    
  src/components/ProjectCard.tsx:8:25
    ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

### Test Failures
```
Failed Tests:
  Unit Tests:
    ❌ UserRegistration › should validate email format
       Expected: "Please enter a valid email"
       Received: "Email is required"
       
  E2E Tests:  
    ❌ Spec 015: User Registration › validation error
       Selector 'data-testid=error-message' not found
```

## Framework-Specific Commands

### For Astro Projects
```bash
# Check Astro-specific formatting
npx prettier --check "**/*.astro"

# Astro type check
npx astro check

# Astro build
npm run build
```

### For Next.js Projects
```bash
# Next.js type check
npx tsc --noEmit

# Next.js build
npm run build
```

## Performance Metrics

Track execution time and provide optimization hints:

```
⏱️  Performance:
  Formatting: 0.8s
  Linting: 2.1s  
  Type Check: 4.3s
  Unit Tests: 6.7s (24 tests)
  E2E Tests: 12.4s (12 scenarios)
  Build: 8.9s
  
  Total: 35.2s

💡 Optimization Tips:
  • Consider using --incremental for TypeScript checking
  • E2E tests could run in parallel with --workers=2
  • Unit test watch mode available for development
```

## Configuration Options

### Quick Mode (faster, less comprehensive)
Check if quick mode is requested in the command arguments:
- Skip coverage reporting
- Skip build verification
- Use incremental TypeScript checking

### CI Mode (optimized for automation)
- Machine-readable output format
- No interactive prompts
- Fail fast on first error

## When to Use

### Before Commits
Always run checks before committing significant changes

### After Spec Implementation  
Verify new features don't break existing functionality

### Before Releases
Full quality verification before deployment

### During Development
Quick checks during active development cycles

## Next Steps on Failure

The command suggests appropriate follow-up actions:

```
🔧 Recommended Actions:

  For automatic fixes:
    /auto-fix-issues
    
  For manual review:
    • Review TypeScript errors in src/lib/api.ts
    • Update E2E test selectors to match components
    • Check spec mock contracts vs actual implementation
    
  For specific checks:
    npm run test -- --watch          # Interactive test development
    npm run typecheck -- --watch     # Watch mode for types
    npm run test:e2e -- --headed     # Debug E2E tests visually
```

This command provides comprehensive quality assurance with clear actionable feedback for maintaining code quality throughout development.