/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    // Automatically clear mock calls, instances and results before every test
    clearMocks: false,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: false,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: ["\\\\node_modules\\\\", "\\\\migrations\\\\"],

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",

    // A list of paths to directories that Jest should use to search for files in
    roots: ["<rootDir>/tests"],

    // The test environment that will be used for testing
    testEnvironment: "node",

    // A map from regular expressions to paths to transformers
    transform: {
        ".+\\.ts$": "ts-jest",
    },
};
