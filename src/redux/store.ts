// store.ts
import { persistStore, persistReducer } from 'redux-persist'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import themeReducer from './slices/theme-slice'
import authReducer from './slices/auth-slice'
import listOptionsReducer from './slices/list-options-slice'
import selectionReducer from './slices/selection-slice';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme' , 'auth', 'listOptions'],
}

const rootReducer = combineReducers({
  // Persisted
  theme: themeReducer,
  auth: authReducer,
  listOptions: listOptionsReducer,

  // Not persisted
  selection: selectionReducer,
})

export type RootReducerState = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer<RootReducerState>(
  persistConfig,
  rootReducer
)

export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
