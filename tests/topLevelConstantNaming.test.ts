import * as topLevelConstantNaming from '../src/lib/topLevelConstantNaming';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

describe('Rules', () => {
  ruleTester.run('top-level-constant-naming', topLevelConstantNaming, {
    valid: [
      // camelCase
      {
        name: 'camelCase',
        code: `const someValue = '';`,
        options: [{ casing: 'camelCase' }],
      },
      // PascalCase
      {
        name: 'PascalCase',
        code: `const SomeValue = '';`,
        options: [{ casing: 'pascalCase' }],
      },
      // snake_case
      {
        name: 'snake_case',
        code: `const some_value = '';`,
        options: [{ casing: 'snakeCase' }],
      },
      // SCREAMING_SNAKE_CASE
      {
        name: 'SCREAMING_SNAKE_CASE',
        code: `const SOME_VALUE = '';`,
        options: [{ casing: 'screamingSnakeCase' }],
      },
      // Skips non-top-level constants
      {
        name: 'Non-top-level is not picked up',
        code: `function someFunction() {
          const someValue = '';
        }`,
        options: [{ casing: 'screamingSnakeCase' }],
      },
      // Omitted file is skipped
      {
        name: 'Omitted file is skipped',
        filename: 'fileOne.ts',
        code: `const someValue = '';`,
        options: [{ casing: 'screamingSnakeCase', pattern: 'fileTwo.ts' }],
      },
      // skips string if omitted
      {
        name: 'skips string if omitted',
        code: `
          const someValue = '';
          const someValueTemplate = \`\`;
        `,
        options: [{ casing: 'snakeCase', skipDeclarationTypes: ['string'] }],
      },
      // skips number if omitted
      {
        name: 'skips number if omitted',
        code: `const someValue = 2;`,
        options: [{ casing: 'snakeCase', skipDeclarationTypes: ['number'] }],
      },
      // skips boolean if omitted
      {
        name: 'skips boolean if omitted',
        code: `const someValue = true;`,
        options: [{ casing: 'snakeCase', skipDeclarationTypes: ['boolean'] }],
      },
      // skips array if omitted
      {
        name: 'skips array if omitted',
        code: `const someValue = [''];`,
        options: [{ casing: 'snakeCase', skipDeclarationTypes: ['array'] }],
      },
      // skips object if omitted
      {
        name: 'skips object if omitted',
        code: `const someValue = {};`,
        options: [{ casing: 'snakeCase', skipDeclarationTypes: ['object'] }],
      },
      // skips function if omitted
      {
        name: 'skips function if omitted',
        code: `const someValue = () => {};`,
        options: [{ casing: 'snakeCase', skipDeclarationTypes: ['function'] }],
      },
    ],
    invalid: [
      // SCREAMING_SNAKE_CASE corrections
      {
        name: 'SCREAMING_SNAKE_CASE corrects properly to camelCase',
        code: `const SOME_VALUE = '';`,
        options: [{ casing: 'camelCase' }],
        errors: ['Constant SOME_VALUE should be styled as someValue'],
        output: `const someValue = '';`,
      },
      {
        name: 'SCREAMING_SNAKE_CASE corrects properly to PascalCase',
        code: `const SOME_VALUE = '';`,
        options: [{ casing: 'pascalCase' }],
        errors: ['Constant SOME_VALUE should be styled as SomeValue'],
        output: `const SomeValue = '';`,
      },
      {
        name: 'SCREAMING_SNAKE_CASE corrects properly to snake_case',
        code: `const SOME_VALUE = '';`,
        options: [{ casing: 'snakeCase' }],
        errors: ['Constant SOME_VALUE should be styled as some_value'],
        output: `const some_value = '';`,
      },
      // snake_case corrections
      {
        name: 'snake_case corrects properly to camelCase',
        code: `const some_value = '';`,
        options: [{ casing: 'camelCase' }],
        errors: ['Constant some_value should be styled as someValue'],
        output: `const someValue = '';`,
      },
      {
        name: 'snake_case corrects properly to PascalCase',
        code: `const some_value = '';`,
        options: [{ casing: 'pascalCase' }],
        errors: ['Constant some_value should be styled as SomeValue'],
        output: `const SomeValue = '';`,
      },
      {
        name: 'snake_case corrects properly to snake_case',
        code: `const some_value = '';`,
        options: [{ casing: 'screamingSnakeCase' }],
        errors: ['Constant some_value should be styled as SOME_VALUE'],
        output: `const SOME_VALUE = '';`,
      },
      // camelCase corrections
      {
        name: 'camelCase corrects properly to PascalCase',
        code: `const someValue = '';`,
        options: [{ casing: 'pascalCase' }],
        errors: ['Constant someValue should be styled as SomeValue'],
        output: `const SomeValue = '';`,
      },
      {
        name: 'camelCase corrects properly to snake_case',
        code: `const someValue = '';`,
        options: [{ casing: 'snakeCase' }],
        errors: ['Constant someValue should be styled as some_value'],
        output: `const some_value = '';`,
      },
      {
        name: 'camelCase corrects properly to SCREAMING_SNAKE_CASE',
        code: `const someValue = '';`,
        options: [{ casing: 'screamingSnakeCase' }],
        errors: ['Constant someValue should be styled as SOME_VALUE'],
        output: `const SOME_VALUE = '';`,
      },
      // PascalCase corrections
      {
        name: 'PascalCase corrects properly to camelCase',
        code: `const SomeValue = '';`,
        options: [{ casing: 'camelCase' }],
        errors: ['Constant SomeValue should be styled as someValue'],
        output: `const someValue = '';`,
      },
      {
        name: 'PascalCase corrects properly to snake_case',
        code: `const SomeValue = '';`,
        options: [{ casing: 'snakeCase' }],
        errors: ['Constant SomeValue should be styled as some_value'],
        output: `const some_value = '';`,
      },
      {
        name: 'PascalCase corrects properly to SCREAMING_SNAKE_CASE',
        code: `const SomeValue = '';`,
        options: [{ casing: 'screamingSnakeCase' }],
        errors: ['Constant SomeValue should be styled as SOME_VALUE'],
        output: `const SOME_VALUE = '';`,
      },
      // Number handling
      {
        name: 'camelCase with numbers',
        code: `const someValue123Test = '';`,
        options: [{ casing: 'snakeCase' }],
        errors: ['Constant someValue123Test should be styled as some_value_123_test'],
        output: `const some_value_123_test = '';`,
      },
      {
        name: 'PascalCase with numbers',
        code: `const SomeValue123Test = '';`,
        options: [{ casing: 'snakeCase' }],
        errors: ['Constant SomeValue123Test should be styled as some_value_123_test'],
        output: `const some_value_123_test = '';`,
      },
      {
        name: 'snake_case with numbers',
        code: `const some_value_123_test = '';`,
        options: [{ casing: 'screamingSnakeCase' }],
        errors: ['Constant some_value_123_test should be styled as SOME_VALUE_123_TEST'],
        output: `const SOME_VALUE_123_TEST = '';`,
      },
      {
        name: 'SCREAMING_SNAKE_CASE with numbers',
        code: `const SOME_VALUE_123_test = '';`,
        options: [{ casing: 'snakeCase' }],
        errors: ['Constant SOME_VALUE_123_test should be styled as some_value_123_test'],
        output: `const some_value_123_test = '';`,
      },
      // Included file is checked
      {
        name: 'Included file is checked',
        filename: 'fileOne.ts',
        code: `const SOME_VALUE_123_test = '';`,
        options: [{ casing: 'snakeCase', pattern: 'fileOne.ts' }],
        errors: ['Constant SOME_VALUE_123_test should be styled as some_value_123_test'],
        output: `const some_value_123_test = '';`,
      },
    ],
  });
});
