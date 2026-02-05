import type { Config } from 'jest';

const config: Config = {
	verbose: true,
	preset: 'ts-jest',
	roots: ['<rootDir>/src'],
	testPathIgnorePatterns: ['/dist/'],
};

export default config;
