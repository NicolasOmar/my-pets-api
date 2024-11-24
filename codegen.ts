
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schemas",
  generates: {
    "src/graphql/generated/resolved.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
