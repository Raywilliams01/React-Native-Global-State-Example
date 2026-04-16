import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TAB_COLORS } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen
        name="redux"
        options={{
          title: 'Redux',
          tabBarActiveTintColor: TAB_COLORS.redux,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="context"
        options={{
          title: 'Context',
          tabBarActiveTintColor: TAB_COLORS.context,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="git-branch-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="zustand"
        options={{
          title: 'Zustand',
          tabBarActiveTintColor: TAB_COLORS.zustand,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
