import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';
import {
  addNotification,
  removeAllNotifications,
  removeNotification,
} from '../../services/notification.service';
import {RepeatFrequency} from '@notifee/react-native';

export interface Reminder {
  id?: string;
  title: string;
  date: string;
  freq?: RepeatFrequency;
}

interface InitialState {
  reminders: Reminder[];
}

const initialState: InitialState = {
  reminders: [],
};

interface SliceState {
  reminderState: {
    reminders: Reminder[];
  };
}

const reminderSlice = createSlice({
  name: 'reminderState',
  initialState,
  reducers: {
    addReminder: (
      state,
      action: PayloadAction<{item: Reminder; notificationTitle: string}>,
    ) => {
      const id = uuid.v4().toString();
      const newItem: Reminder = {
        id,
        title: action.payload.item.title,
        date: action.payload.item.date,
        freq: action.payload.item.freq,
      };
      const allItems = [...state.reminders];
      allItems.push(newItem);
      state.reminders = allItems;
      addNotification(action.payload.notificationTitle, newItem)
        .then(() => console.log('notification created'))
        .catch(e => console.log('error ', e));
    },
    removeReminder: (state, action: PayloadAction<{id: string}>) => {
      if (action.payload.id) {
        const allItems = [...state.reminders];
        const newList = allItems.filter(el => el.id !== action.payload.id);
        state.reminders = newList;
        removeNotification(action.payload.id)
          .then(() => console.log('notification removed'))
          .catch(e => console.log('error ', e));
      }
    },
    updateReminder: () => {
      // TODO
    },
    removeAll: state => {
      state.reminders = [];
      removeAllNotifications()
        .then(() => console.log('all removed'))
        .catch(err => console.log({err}));
    },
  },
});

export const {addReminder, removeReminder, updateReminder, removeAll} =
  reminderSlice.actions;

export const selectReminders = (state: SliceState) =>
  state.reminderState.reminders;

export default reminderSlice.reducer;
