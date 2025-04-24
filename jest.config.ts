import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest', //preset for TypeScript support
    testEnvironment: 'jsdom', //test environment simulation
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], //points to setupTests.ts for additional test setup
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest', //sets up file transformation for TypeScript files
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': { //configures ts-jest with TypeScript compiler options
            tsconfig: 'tsconfig.json',
            diagnostics: {
                warnOnly: true //sets warnings-only for diagnostics
            }
        },
    rootDir: './',
    roots: ['<rootDir>/src'] //set to look for tests in the src directory
    },
};


export default config;