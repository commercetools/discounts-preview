/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 commercetools GmbH and the commercetools-labs contributors
 * Freely available, AS IS and UNSUPPORTED. See LICENSE.
 */

process.env.ENABLE_NEW_JSX_TRANSFORM = 'true';

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ['@commercetools-frontend/eslint-config-mc-app'],
  plugins: ['@graphql-eslint'],
  overrides: [
    {
      files: ['**/*.ctp.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      parserOptions: {
        graphQLConfig: {
          schema: './schemas/ctp.json',
        },
      },
      rules: {
        '@graphql-eslint/known-type-names': 'error',
        '@graphql-eslint/known-argument-names': 'error',
        '@graphql-eslint/known-directives': 'error',
        '@graphql-eslint/scalar-leafs': 'error',
      },
    },
  ],
};
