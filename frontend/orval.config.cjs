module.exports = {
  "api-gateway": {
    input: "./openapi.json",
    output: {
      mode: "split",
      target: "./src/shared/api/Api.ts",
      hooks: {
        afterAllFilesWrite: "prettier --write",
      },
      override: {
        mutator: {
          path: "./src/shared/api/index.ts",
          name: "customInstance",
        },
      },
    },
  },
};
