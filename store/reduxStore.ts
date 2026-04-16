import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { name: 'Ada', count: 0 },
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.name = 'Ada';
      state.count = 0;
    },
  },
});

export const { setName, increment, decrement, reset } = counterSlice.actions;

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
