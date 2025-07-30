# Auto Fix Issues

Automatically resolve common code quality issues using spec context and best practices.

## What This Command Does

Attempts to automatically fix issues found by `/run-all-checks`:

1. **Format Code** - Apply Prettier formatting
2. **Fix Lint Issues** - Auto-fix ESLint errors where possible
3. **Add Missing Imports** - Fix common TypeScript import errors
4. **Sync Mock Contracts** - Update APIs to match shared mocks
5. **Fix Test Selectors** - Add missing data-testid attributes

## Execution Strategy

### Phase 1: Safe Auto-Fixes
Issues that can be fixed automatically without changing logic:

```bash
# Auto-format all code
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md,astro}"

# Fix auto-fixable ESLint issues
npm run lint -- --fix

# Remove unused imports and variables
# Fix import order and organization
```

### Phase 2: Spec-Guided Fixes
Use spec contracts to resolve common mismatches:

```typescript
// Update API responses to match shared mocks
export async function POST(request: NextRequest) {
  // Ensure response matches spec mock exactly
  return NextResponse.json(apiMocks.feature.operation.response);
}

// Add missing data-testid attributes based on E2E test failures
<Button data-testid="submit-button" type="submit">
  Submit
</Button>

// Fix type definitions using spec mock structure
interface User {
  // Add fields based on spec mock structure
  id: number;
  name: string;
  email: string;
}
```

### Phase 3: Test Integration
Fix common test issues:

```typescript
// Update test expectations to match spec mocks
expect(result).toEqual(apiMocks.feature.operation.response);

// Add missing E2E test selectors
await page.getByTestId('error-message').waitFor();
```

## Fix Categories

### ✅ Safe Auto-Fixes (No Review Needed)
- **Code formatting** with Prettier
- **Import organization** (sort, remove unused)
- **ESLint auto-fixable rules** (semicolons, quotes, spacing)
- **Unused variable removal**
- **Missing await keywords**

### 🔍 Spec-Guided Fixes (Low Risk)
- **API response format** to match shared mocks
- **Type definitions** from spec mock structure
- **Test expectations** using spec contracts
- **Data-testid attributes** for E2E test compatibility

### ⚠️ Manual Review Required (Skip These)
- **Breaking logic changes**
- **Complex type refactoring** 
- **Database schema changes**
- **Authentication/security modifications**

## Output and Reporting

### Success Report
```
🔧 Auto-Fix Results

✅ Formatting: Fixed 12 files
✅ Linting: Fixed 8 issues automatically
✅ Types: Added 3 missing imports
✅ Tests: Added 4 missing data-testid attributes
✅ Mocks: Synced 2 API responses with shared mocks

📊 Summary:
  • 27 issues fixed automatically
  • 0 issues require manual review
  • All quality checks now pass

🚀 Ready for commit!
```

### Partial Fix Report
```
🔧 Auto-Fix Results

✅ Formatting: Fixed 12 files
✅ Linting: Fixed 8 issues automatically  
⚠️  Types: 1 complex error requires manual review
✅ Tests: Added 4 missing data-testid attributes

📊 Summary:
  • 24 issues fixed automatically
  • 1 issue requires manual review
  
⚠️  Remaining Issues:
  src/lib/database.ts:45:12
    Complex type mismatch in user authentication flow
    Manual review needed for security implications

🔍 Run /run-all-checks to verify remaining issues
```

## Common Fix Patterns

### Mock Contract Synchronization
```typescript
// Fix API to match spec mock
return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    name: user.name,
    email: user.email
    // Remove any extra fields not in spec
  }
});
```

### Missing Test Selectors
```tsx
// Add missing data-testid based on failing E2E test
<Input 
  data-testid="email-input" // Added based on test selector
  type="email"
  {...register('email')}
/>

{errors.email && (
  <span data-testid="email-error"> {/* Added for E2E testing */}
    {errors.email.message}
  </span>
)}
```

### Import Organization
```typescript
// Before: Messy imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// After: Organized imports
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
```

## When to Stop and Ask

- **Complex business logic** changes needed
- **Breaking changes** to existing APIs
- **Security-related** modifications
- **Database migration** requirements
- **Multiple failing tests** indicating design issues

## Integration with Development Workflow

### Pre-Commit Automation
```bash
# Typical workflow
/implement-spec 015
/run-all-checks
/auto-fix-issues    # This command
/run-all-checks     # Verify fixes
git commit          # Only when clean
```

This command provides **intelligent, safe fixes** that leverage your spec-driven development approach for maximum reliability while **avoiding risky changes** that need human judgment.