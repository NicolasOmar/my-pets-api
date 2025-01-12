import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'build', 'src/graphql/generated', 'src/graphql/schemas', 'coverage'] },
  {
    extends: [pluginJs.configs.recommended, ...tseslint.configs.recommended,],
    files: ['src/**/*.{js,ts}'],
    languageOptions: { globals: globals.node },
    ignores: ['src/functions/dbOps.ts']
  }
)