# eslint-plugin-top-level-constant-naming

A plugin providing a rule that enforces a naming convention for top-level constants.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-top-level-constant-naming`:

```sh
npm install eslint-plugin-top-level-constant-naming --save-dev
```

## Usage

Add `top-level-constant-naming` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "top-level-constant-naming"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "top-level-constant-naming/top-level-constant-naming": [
      "warning",
      {
        "casing": "camelCase",
        "pattern": "**/index.ts",
        "skipDeclarationTypes": ["function"]
      }
    ]
  }
}
```

## Supported rules

```
top-level-constant-naming/top-level-constant-naming
```

## Configuration

```json
{
  "top-level-constant-naming/top-level-constant-naming": [
    "error",
    {
      "casing": "camelCase",
      "pattern": "**/index.ts",
      "skipDeclarationTypes": ["function"]
    }
  ]
}
```

Options can be any of the following properties:

- `casing`: Required string defining which case should be enforced, can be "camelCase", "pascalCase", "snakeCase", or "screamingSnakeCase"
- `pattern`: Optional glob pattern that if provided will match only files that fit the pattern for applying the rule
- `skipDeclarationTypes`: Optional array of declaration types that will be skipped by the rule. May include any of "string", "number", "boolean", "array", "object" or "function". 


