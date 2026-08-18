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
