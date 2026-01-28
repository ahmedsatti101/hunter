module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@s77rt/react-native-date-picker|@react-native|@rn-primitives|lucide-react-native|@react-native-community|react-native-.*)/)'
  ],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/$1",
    '\\.(css|less|scss|sass)$': '<rootDir>/styleMock.js',
  }
};
