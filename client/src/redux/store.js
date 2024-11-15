import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userSlice from "./user/userSlice";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import themeSlice from "./theme/themeSlice";
const rootReducer = combineReducers({
    user:userSlice,
    theme:themeSlice,
});

const persistConfig={
    key:"root",
    storage,
    version:1
}

const persistedReducer=persistReducer(persistConfig,rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);