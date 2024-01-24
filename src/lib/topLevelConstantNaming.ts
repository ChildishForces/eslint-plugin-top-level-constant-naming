import type { Rule } from 'eslint';
import type { FromSchema } from 'json-schema-to-ts';
import { StringCase } from './constants';
import type { Literal, Node, VariableDeclarator } from 'estree';
import { transformStringToCase } from './stringUtilities';
import { minimatch } from 'minimatch';

const schema = {
  type: 'object',
  required: ['casing'],
  properties: {
    casing: {
      type: 'string',
      description: 'The casing that should be applied to all top level constants',
      enum: [
        StringCase.PascalCase,
        StringCase.SnakeCase,
        StringCase.ScreamingSnakeCase,
        StringCase.CamelCase,
      ],
    },
    pattern: {
      type: 'string',
      description: 'A glob pattern of files to include. If none supplied, all files are valid',
    },
    skipDeclarationTypes: {
      type: 'array',
      description:
        'Should the rule skip certain types of declarations, such as `function` or `number`',
      items: {
        type: 'string',
        enum: ['string', 'number', 'boolean', 'array', 'object', 'function'],
      },
    },
  },
  additionalProperties: false,
} as const;

export const meta = {
  type: 'suggestion',
  docs: {
    description: 'Enforce a naming convention for top level constants',
    category: 'ECMAScript 6',
    recommended: false,
    url: '',
  },
  schema: [schema],
  fixable: 'code',
} satisfies Rule.RuleModule['meta'];

export const create: Rule.RuleModule['create'] = (context) => {
  const [options] = context.options;
  const { casing, pattern, skipDeclarationTypes } = options as FromSchema<typeof schema>;

  if (pattern && !minimatch(context.getFilename(), pattern)) return {};

  const isDeclarationTypeOmitted = (node?: Node | null): boolean => {
    if (!node) return false;
    if (!skipDeclarationTypes) return false;

    const checkLiteral = (node: Literal, type: 'string' | 'number' | 'boolean') => {
      return skipDeclarationTypes.includes(type) && typeof node.value === type;
    };

    switch (node?.type) {
      case 'ArrowFunctionExpression':
        if (skipDeclarationTypes.includes('function')) return true;
        break;
      case 'ObjectExpression':
        if (skipDeclarationTypes.includes('object')) return true;
        break;
      case 'ArrayExpression':
        if (skipDeclarationTypes.includes('array')) return true;
        break;
      case 'TemplateLiteral':
        if (skipDeclarationTypes.includes('string')) return true;
        break;
      case 'Literal':
        if (checkLiteral(node, 'boolean')) return true;
        if (checkLiteral(node, 'string')) return true;
        if (checkLiteral(node, 'number')) return true;
        break;
      default:
        return false;
    }

    return false;
  };

  const walkTopLevelConstantDeclarations = (
    node: VariableDeclarator & Rule.NodeParentExtension
  ) => {
    const { id, init, parent } = node;

    if (parent.type !== 'VariableDeclaration') return;
    if (parent.kind !== 'const') return;
    if (parent.parent.type !== 'Program') return;
    if (isDeclarationTypeOmitted(init)) return;

    if (id.type === 'Identifier') {
      const { name } = id;
      const expected = transformStringToCase(name, casing);

      if (name !== expected) {
        context.report({
          message: `Constant ${name} should be styled as ${expected}`,
          node,
          fix: (fixer) => fixer.replaceTextRange(id.range!, expected),
        });
      }
    }
  };

  return {
    VariableDeclarator(node) {
      walkTopLevelConstantDeclarations(node);
    },
  };
};
