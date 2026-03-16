import "@testing-library/react-native";
import "react-native-gesture-handler/jestSetup"
export * from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn().mockResolvedValue({ type: 'cancel' }),
  dismissBrowser: jest.fn(),
  warmUpAsync: jest.fn(),
  coolDownAsync: jest.fn(),
  mayInitWithUrlAsync: jest.fn(),
  maybeCompleteAuthSession: jest.fn()
}));
