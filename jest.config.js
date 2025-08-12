module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?)',
  ],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  }
};
