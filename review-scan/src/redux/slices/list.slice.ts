import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';

export interface Item {
  title: string;
  quantity: number;
  quantityDone?: number;
}

export interface List {
  id: string;
  title: string;
  emoji: string;
  items: Item[];
}

export interface MainList {
  id: string;
  title: string;
  image: string;
  items: List[];
}

interface SliceState {
  listState: {
    list: MainList[];
    currentList: MainList | null;
  };
}

interface InitialState {
  list: MainList[];
  currentList?: MainList | null;
}

const initialState: InitialState = {
  list: [],
  currentList: null,
};

const authSlice = createSlice({
  name: 'listState',
  initialState,
  reducers: {
    setCurrentList: (state, action: PayloadAction<{item: MainList}>) => {
      state.currentList = action.payload.item;
    },
    changeMainList: (
      state,
      action: PayloadAction<{
        items: MainList[];
      }>,
    ) => {
      state.list = action.payload.items;
    },
    addMainList: state => {
      if (state.currentList) {
        const newItem: MainList = {
          id: state.currentList.id,
          image: state.currentList.image,
          title: state.currentList.title,
          items: state.currentList.items,
        };
        const allItems = [...state.list];
        allItems.push(newItem);
        state.list = allItems;
        state.currentList = null;
      }
    },
    changePositions: (
      state,
      action: PayloadAction<{
        id: string;
        items: List[];
      }>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);
      allItems[idx].items = action.payload.items;
      state.list = allItems;
    },
    addItemtoCategory: (
      state,
      action: PayloadAction<{
        title: string;
        quantity: number;
        id: string;
        idList: string;
      }>,
    ) => {
      const newItem: Item = {
        title: action.payload.title,
        quantity: action.payload.quantity,
        quantityDone: 0,
      };
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);
      const elements = allItems[idx].items;
      const idx2 = elements.map(e => e.id).indexOf(action.payload.idList);
      elements[idx2].items.push(newItem);
      state.list = allItems;
    },
    removeElementAsDone: (
      state,
      action: PayloadAction<{
        position: number;
        parentId: string;
        categoryId: string;
      }>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.parentId);
      const elements = allItems[idx].items;
      const idx2 = elements.map(e => e.id).indexOf(action.payload.categoryId);
      elements[idx2].items.splice(action.payload.position, 1);

      state.list = allItems;
    },
    markElementAsDone: (
      state,
      action: PayloadAction<{
        position: number;
        parentId: string;
        categoryId: string;
        done: boolean;
      }>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.parentId);
      const elements = allItems[idx].items;
      const idx2 = elements.map(e => e.id).indexOf(action.payload.categoryId);
      if (action.payload.done) {
        elements[idx2].items[action.payload.position].quantityDone =
          elements[idx2].items[action.payload.position].quantity;
      } else {
        elements[idx2].items[action.payload.position].quantityDone = 0;
      }

      state.list = allItems;
    },
    changeTitle: (
      state,
      action: PayloadAction<{title: string; id: string}>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);

      if (idx !== -1) {
        allItems[idx].title = action.payload.title;
      }
      state.list = allItems;
    },
    changeImage: (
      state,
      action: PayloadAction<{image: string; id: string}>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);

      if (idx !== -1) {
        allItems[idx].image = action.payload.image;
      }
      state.list = allItems;
    },
    changeTitleCurrentList: (state, action: PayloadAction<{title: string}>) => {
      if (state.currentList) {
        state.currentList.title = action.payload.title;
      }
    },
    changeImageCurrentList: (state, action: PayloadAction<{image: string}>) => {
      if (state.currentList) {
        state.currentList.image = action.payload.image;
      }
    },
    addCategory: (
      state,
      action: PayloadAction<{
        title: string;
        emoji: string;
        id: string;
        items?: Item[];
      }>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);
      allItems[idx].items.push({
        id: uuid.v4().toString(),
        title: action.payload.title,
        emoji: action.payload.emoji,
        items: action.payload.items ? action.payload.items : [],
      });
      state.list = allItems;
    },
    editCategory: (
      state,
      action: PayloadAction<{
        title: string;
        emoji: string;
        id: string;
        parentId: string;
      }>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.parentId);
      const idx2 = allItems[idx].items
        .map(e => e.id)
        .indexOf(action.payload.id);
      allItems[idx].items[idx2].title = action.payload.title;
      allItems[idx].items[idx2].emoji = action.payload.emoji;
      state.list = allItems;
    },
    removeList: (
      state,
      action: PayloadAction<{id: string; idList: string}>,
    ) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);
      const elements = allItems[idx].items;
      const idx2 = elements.map(e => e.id).indexOf(action.payload.idList);
      elements.splice(idx2, 1);
      state.list = allItems;
    },
    removeMainList: (state, action: PayloadAction<{id: string}>) => {
      const allItems = [...state.list];
      const idx = allItems.map(e => e.id).indexOf(action.payload.id);
      allItems.splice(idx, 1);
      state.list = allItems;
    },
  },
});

export const {
  setCurrentList,
  changeMainList,
  changeTitleCurrentList,
  addMainList,
  changePositions,
  removeMainList,
  addCategory,
  editCategory,
  changeTitle,
  removeList,
  changeImage,
  changeImageCurrentList,
  addItemtoCategory,
  markElementAsDone,
  removeElementAsDone,
} = authSlice.actions;

export const selectList = (state: SliceState) => state.listState.list;

export const selectCurrentList = (state: SliceState) =>
  state.listState.currentList;

export default authSlice.reducer;
