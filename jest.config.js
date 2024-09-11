module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.mjs$": "babel-jest", // Add this line to handle .mjs files
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)"],
};
