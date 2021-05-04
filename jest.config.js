module.exports = {
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(\\.|/)spec\\.(js|ts)$',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  roots: ['<rootDir>/src'],
  collectCoverage: false,
  coveragePathIgnorePatterns: ['/node_modules'],
}
