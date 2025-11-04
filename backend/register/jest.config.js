module.exports = {
	testEnvironment: "node",
	collectCoverageFrom: [
		"index.js",
		"service/**/*.js",
		"utils/**/*.js"
	],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov"],
	resetMocks: true
};
