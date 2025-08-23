/*** Author: Santosh Kulkarni ***/
import { test } from '@playwright/test';
import { KeywordActions } from '../Utility/KeywordActions';
import keywordTests from '../data/keywordTests.json';
import { getLoginData } from '../Utility/csvReader';

// -----------------------------
// Types for clarity
// -----------------------------
type LoginUser = {
  usernameFromCSV: string;
  passwordFromCSV: string;
};

type KeywordStep = {
  keyword: string;
  value?: string;
};

type KeywordScenario = {
  testName: string;
  steps: KeywordStep[];
};

// -----------------------------
// Load users from CSV
// -----------------------------
const loginUsers: LoginUser[] = getLoginData('src/data/loginData.csv');

// -----------------------------
// Keyword-Driven Login Tests
// -----------------------------
test.describe('Keyword-Driven Login Tests', () => {
  loginUsers.forEach((user, userIndex) => {
    (keywordTests as KeywordScenario[]).forEach((scenario, scenarioIndex) => {
      // ✅ Ensure unique test name by appending scenario & user index
      const testName = `${scenario.testName} - User: ${user.usernameFromCSV} [S${scenarioIndex + 1}-U${userIndex + 1}]`;

      test(testName, async ({ page }) => {
        const actions = new KeywordActions(page);

        for (const step of scenario.steps) {
          let value = step.value;

          // ✅ Replace placeholders dynamically
          switch (value) {
            case '$USERNAME':
              value = user.usernameFromCSV;
              break;
            case '$PASSWORD':
              value = user.passwordFromCSV;
              break;
          }

          await test.step(`${step.keyword}${value ? ` (${value})` : ''}`, async () => {
            try {
              await actions.perform(step.keyword, value);
            } catch (err) {
              console.error(
                `Keyword step failed: ${step.keyword}, User: ${user.usernameFromCSV}`,
              );
              throw err;
            }
          });
        }
      });
    });
  });
});
