import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from '../redux/slices/auth.slice';
import AppReducer from '../redux/slices/app.slice';
import ListReducer from '../redux/slices/list.slice';
import ReminderReducer from '../redux/slices/reminder.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import {PersistConfig} from 'redux-persist/es/types';

const reducers = combineReducers({
  authState: AuthReducer,
  appState: AppReducer,
  listState: ListReducer,
  reminderState: ReminderReducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
export type RootState = ReturnType<typeof reducers>;
export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];
