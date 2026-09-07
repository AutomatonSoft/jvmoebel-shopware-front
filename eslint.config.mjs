import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,

  {
    rules: {
      // Неиспользуемые переменные
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // any лучше избегать, но иногда он реально нужен
      "@typescript-eslint/no-explicit-any": "warn",

      // Если переменную можно сделать const — заставляем сделать const
      "prefer-const": "error",

      // Не использовать == и !=
      eqeqeq: ["error", "always"],

      // console.log желательно не оставлять в production-коде
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },

  {
    files: ["src/features/**/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/integrations/**"],
              message:
                "Feature UI must use its feature API instead of app or integration modules.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**", "@/features/**", "@/integrations/**"],
              message:
                "Shared UI components must not depend on app, feature, or integration modules.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/integrations/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app/**",
                "@/components/**",
                "@/features/**/components/**",
                "@/features/**/server/**",
              ],
              message:
                "Integration modules may depend on feature models, not UI or orchestration.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),

  // Обязательно последним.
  // Отключает ESLint-правила, конфликтующие с Prettier.
  eslintConfigPrettier,
]);
