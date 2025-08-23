// src/tests/KeywordDrivenLogin.spec.ts
import { test } from '@playwright/test';
import { KeywordActions } from '../Utility/KeywordActions';
import keywordTests from '../data/keywordTests.json';
import { getLoginData } from '../../src/Utility/csvReader';

const loginUsers = getLoginData('src/data/loginData.csv'); // Read users from CSV

test.describe('Keyword-Driven Login Tests', () => {
  loginUsers.forEach((user, userIndex) => {
    keywordTests.forEach((scenario, scenarioIndex) => {
      // ✅ Ensure unique test name by appending scenario & user index
      test(
        `${scenario.testName} - User: ${user.usernameFromCSV} [S${scenarioIndex + 1}-U${userIndex + 1}]`,
        async ({ page }) => {
          const actions = new KeywordActions(page);

          for (const step of scenario.steps) {
            let value = step.value;

            // ✅ Replace placeholders with CSV values
            if (value === '$USERNAME') {
              value = user.usernameFromCSV;
            } else if (value === '$PASSWORD') {
              value = user.passwordFromCSV;
            }

            await test.step(
              `${step.keyword}${value ? ` (${value})` : ''}`,
              async () => {
                await actions.perform(step.keyword, value);
              }
            );
          }
        }
      );
    });
  });
});
