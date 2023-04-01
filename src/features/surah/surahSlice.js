import { createSlice } from "@reduxjs/toolkit";

const surahSlice = createSlice({
    name: 'surah',
    initialState: {
        english: {},
        audio: {}
    },
    reducers: {
        setEnglish: (state, action) => {
            state.english = action.payload;
        },
        setAudio: (state, action) => {
            state.audio = action.payload;
        }
    }

})

export const { setAudio, setEnglish } = surahSlice.actions;
export default surahSlice.reducer