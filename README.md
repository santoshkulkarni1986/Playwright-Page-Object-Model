# Playwright Page Object Model Framework Guide

This is a Playwright automation framework using Page Object Model (POM) and data-driven testing approaches. Here's what you need to know to work effectively with this codebase.

- `src/pages/`: Page Object Models (e.g., `loginPage.ts`, `WelcomePage.ts`)
- `src/tests/`: Test specifications
- `src/data/`: Test data files (CSV, JSON, Excel)
- `src/Utility/`: Helper utilities for data handling
- `src/helper/env/`: Environment configuration

## Project Structure

## Key Patterns

### 1. Page Object Model Implementation

Each page in the application has its own class that encapsulates the page's functionality.

```typescript
// Example from loginPage.ts
export class LoginPage {
    private page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByLabel('Username');
        this.passwordInput = page.getByLabel('Password');
    }

    async enterUserName(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }
}
```

### 2. Data-Driven Testing

The framework supports multiple data sources:

- Environment variables
- CSV files
- JSON files
- Excel files

```typescript
// Example of TestData interface
interface TestData {
    testCaseName: string;
    execute: string;
    env: string;
    url: string;
    username: string;
    password: string;
}

// Example of test result interface
interface TestResult extends TestData {
    status: string;
    browser: string;
    timestamp: string;
    screenshotPath?: string;
}
```

## Running Tests

Here are the common commands to run tests:

```bash
# Run all tests
npm run test

# Run specific test file
npx playwright test src/tests/login.spec.ts

# Run tests with specific browser
npx playwright test --project="Google Chrome"
```

## Best Practices

1. **Use Page Objects**: All element interactions should go through page object classes
2. **Error Handling**: Use try-catch blocks with proper logging
3. **Data Management**: Store test data in appropriate format (CSV/JSON/Excel)
4. **Logging**: Use the custom logger for all actions and verifications
5. **Screenshots**: Capture screenshots on test failures

## Integration Points

- Playwright for browser automation
- Excel/CSV/JSON for data storage
- Environment variables for configuration
- Custom logging system
- Multiple reporting formats (HTML, JUnit XML)
