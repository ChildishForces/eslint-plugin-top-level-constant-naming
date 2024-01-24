/**
 * @fileoverview enforces a naming convention for top level constants
 * @author Chris Schofield
 */

import type { ESLint } from 'eslint';
import * as topLevelConstantNaming from './topLevelConstantNaming';

export const meta: ESLint.Plugin['meta'] = {
  name: 'eslint-plugin-top-level-constant-naming',
  version: '1.0.0',
};

export const rules: ESLint.Plugin['rules'] = {
  'top-level-constant-naming': topLevelConstantNaming,
};
