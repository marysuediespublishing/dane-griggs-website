# Auto Fix Issues (Comprehensive)

Automatically resolve code quality issues using advanced spec context and detailed analysis.

## What This Command Does

Attempts to automatically fix complex issues found by quality checks:

1. **Format Code** - Apply Prettier formatting
2. **Fix Lint Issues** - Auto-fix ESLint errors where possible
3. **Resolve Type Errors** - Fix TypeScript issues using spec context
4. **Update Test Contracts** - Sync tests with shared mock contracts
5. **Fix E2E Test Selectors** - Update data-testid attributes to match components
6. **API Mock Drift Resolution** - Detect and fix API/mock mismatches
7. **Advanced Pattern Fixes** - Handle complex architectural issues

## Execution Strategy

### Phase 1: Safe Auto-Fixes
Issues that can be fixed automatically without changing logic:

```bash
# Auto-format all code
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md,astro}"

# Fix auto-fixable ESLint issues
npm run lint -- --fix

# Add missing imports (TypeScript)
# Remove unused variables
# Fix import order
```

### Phase 2: Spec-Guided Fixes
Use spec contracts to resolve data structure mismatches:

#### Mock Contract Synchronization
```typescript
// If API response doesn't match shared mock
// Update API to match spec mock contract
export async function POST(request: NextRequest) {
  // Check spec: analyze shared mocks for correct structure
  // Ensure response matches exactly:
  return NextResponse.json(apiMocks.user.create.response);
}
```

#### Type Definition Updates
```typescript
// If TypeScript errors about missing properties
// Check spec mocks for correct interface
interface User {
  id: number;
  name: string;
  email: string;
  // Add fields based on spec mock structure
  createdAt?: string;
  updatedAt?: string;
}
```

#### Test Data Synchronization
```typescript
// Update test expectations to match spec mocks
expect(result).toEqual(
  apiMocks.user.create.response // Use exact spec mock
);

// Fix validation message alignment
.email('Please enter a valid email address') // Match spec mock error text
```

### Phase 3: E2E Test Repairs
Fix common E2E test issues by referencing spec scenarios:

#### Missing Data-TestId Attributes
```tsx
// Add missing test selectors based on E2E test failures
<Input
  data-testid="email-input" // Add based on failing test
  {...register('email')}
/>

<Button
  data-testid="submit-button" // Add based on spec scenarios
  type="submit"
>
  Submit
</Button>
```

#### Selector Updates
```typescript
// Update E2E tests if component structure changed
test('user sees validation error', async ({ page }) => {
  // Check if data-testid exists, suggest alternatives
  await page.getByTestId('error-message').waitFor();
  // or
  await page.getByRole('alert').waitFor();
});
```

### Phase 4: Advanced Fixes

#### API Mock Drift Resolution
```typescript
// Detect when real API response differs from mock
// Update either the API or the mock based on spec intention

// Check spec contract:
const specMock = apiMocks.user.create.response;

// Fix API to match:
export async function POST(request: NextRequest) {
  const user = await createUser(validated);
  
  // Return exactly what spec expects
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
      // Remove any extra fields not in spec
    }
  });
}
```

#### Type-Safe Mock References
```typescript
// Generate TypeScript interfaces from spec mocks
type UserCreateRequest = typeof apiMocks.user.create.request;
type UserCreateResponse = typeof apiMocks.user.create.response;

// Fix component props to match
interface UserFormProps {
  onSuccess: (response: UserCreateResponse) => void;
}
```

#### Component-Test Synchronization
```tsx
// Fix missing data-testid based on failing E2E test
export function UserForm() {
  return (
    <form>
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
    </form>
  );
}
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
- **Validation messages** matching spec error text
- **Data-testid attributes** for E2E test compatibility

### ⚠️ Manual Review Required (High Risk)
- **Breaking logic changes**
- **Complex type refactoring**
- **Database schema changes**
- **Authentication/security modifications**
- **Cross-component dependencies**

## Output and Reporting

### Success Report
```
🔧 Comprehensive Auto-Fix Results

✅ Formatting: Fixed 12 files with Prettier
✅ Linting: Fixed 8 ESLint issues automatically
✅ Types: Resolved 3 interface mismatches using spec mocks
✅ Tests: Updated 2 test expectations to match shared mocks
✅ E2E: Added 4 missing data-testid attributes
✅ API Sync: Fixed 1 response format to match spec contract
✅ Imports: Organized and cleaned 6 import statements

📊 Summary:
  • 36 issues fixed automatically
  • 0 issues require manual review
  • All quality checks now pass

🚀 Ready for commit!
```

### Partial Fix Report
```
🔧 Comprehensive Auto-Fix Results

✅ Formatting: Fixed 12 files
✅ Linting: Fixed 8 issues automatically  
⚠️  Types: 1 complex error requires manual review
✅ E2E: Added 4 missing data-testid attributes
✅ API Sync: Fixed 2 response formats

📊 Summary:
  • 26 issues fixed automatically
  • 1 issue requires manual review
  
⚠️  Remaining Issues:
  src/lib/database.ts:45:12
    Complex type mismatch in user authentication flow
    Manual review needed for security implications

🔍 Run /run-all-checks to verify remaining issues
```

### Advanced Analysis Report
```
🔍 Advanced Analysis:

Mock Contract Drift Detected:
  • API /api/users returns extra field 'lastLogin' not in spec
  • Recommendation: Remove field or update spec mock

Type Safety Improvements:
  • Added 3 missing TypeScript interfaces from spec mocks
  • Fixed 2 component prop types to match API responses

E2E Test Synchronization:
  • Updated 4 selectors to match current component structure
  • Added 2 missing data-testid attributes for test coverage
```

## Advanced Fix Patterns

### Dynamic Mock Validation
```typescript
// Validate API responses against spec mocks at runtime
const validateResponse = (response: any, mockPath: string) => {
  const expectedMock = getMockByPath(mockPath);
  const isValid = deepEqual(response, expectedMock);
  if (!isValid) {
    console.warn(`API response doesn't match mock: ${mockPath}`);
  }
  return response;
};
```

### Intelligent Error Message Mapping
```typescript
// Map validation errors to spec mock error messages
const getSpecErrorMessage = (field: string, errorType: string) => {
  const mockError = apiMocks.user.validation[`${field}${errorType}`];
  return mockError?.response?.error || `${field} is invalid`;
};
```

### Component Test Synchronization
```typescript
// Auto-generate data-testid based on component usage in tests
const addTestIds = (component: string, scenarios: string[]) => {
  scenarios.forEach(scenario => {
    // Add data-testid attributes based on test scenarios
  });
};
```

## Configuration Options

### Conservative Mode (default)
- Only apply safe auto-fixes
- Require confirmation for logic changes
- Preserve existing behavior where possible

### Aggressive Mode
```bash
# Apply spec-guided fixes without confirmation
# Update APIs to match mocks
# Modify component interfaces
```

### Dry Run Mode
```bash
# Show what would be fixed without applying changes
# Generate fix preview with diff output
# Help decide which fixes to apply manually
```

## Integration with Development Workflow

### Pre-Commit Hook
Automatically run before commits to catch issues early

### CI/CD Integration
Include in automated testing pipeline for consistency

### Development Loop
```bash
# Make changes
/implement-spec 015

# Check quality
/run-all-checks

# Comprehensive auto-fix
/auto-fix-issues

# Verify fixes
/run-all-checks

# Commit when clean
git commit -m "Implement spec 015: User registration with comprehensive fixes"
```

## When to Stop and Ask

- **Security implications** in authentication/authorization changes
- **Breaking changes** that affect multiple components
- **Database schema modifications** needed
- **Complex business logic** requiring domain knowledge
- **Performance implications** of suggested changes

This command provides **comprehensive, intelligent fixes** that leverage your spec-driven development approach for maximum reliability and consistency while maintaining safety through careful categorization of fix types.