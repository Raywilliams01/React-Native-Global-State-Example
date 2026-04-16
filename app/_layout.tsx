import { Provider } from 'react-redux';
import { store } from '@/store/reduxStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </Provider>
  );
}
