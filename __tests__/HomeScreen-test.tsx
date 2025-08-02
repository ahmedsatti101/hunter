import { render } from '@testing-library/react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import HomeScreen from '@/app/(tabs)/index';

beforeEach(() => {
  useBottomTabBarHeight()
})

describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    const { getByText } = render(<HomeScreen />);

    getByText('Welcome!');
  });
});
