import { createSlice , PayloadAction } from "@reduxjs/toolkit";


interface ListOptionsState {
    option? : 'table' | 'card';
}

const initialState: ListOptionsState = {
    option: 'table',
};

const listOptionsSlice = createSlice({
    name: 'listOptions',
    initialState,
    reducers: {
        setOption: (state, action: PayloadAction<'table' | 'card'>) => {
            state.option = action.payload;
        },
    },
});

export const { setOption } = listOptionsSlice.actions;
export default listOptionsSlice.reducer;