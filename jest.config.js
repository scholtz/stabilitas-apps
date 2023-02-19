// Sync object
const config = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testTimeout: 60000,
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(axios)/)"],
};
export default config;
