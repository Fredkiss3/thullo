module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '@thullo/domain': '<rootDir>/src',
        testPathIgnorePatterns: ['<rootDir>/scripts/templates/usecases/tests/usecases/'],
        modulePathIgnorePatterns: [
            '<rootDir>/scripts/templates/tests/usecases/'
        ],
        watchPathIgnorePatterns: ['<rootDir>/scripts/templates/tests/usecases/']
    }
};
