import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    email: '',
    token: '',
  },
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    clearUser(state) {
     
      state.token = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;