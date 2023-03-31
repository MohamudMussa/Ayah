import apiSlice from "../api/apiSlice";
import { setAudio, setEnglish } from "../surah/surahSlice";

const randomAyahSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        randomEnglishAyah: builder.query({
            query: (ayahNumber) => `ayah/${ayahNumber}/en.sahih`,
            async onQueryStarted(args, { queryFulfilled, dispatch }) {
                const result = await queryFulfilled;
                dispatch(setEnglish(result.data.data));
            }
        }),
        randomAudioAyah: builder.query({
            query: (ayahNumber) => `ayah/${ayahNumber}/ar.hudhaify`,
            async onQueryStarted(args, { queryFulfilled, dispatch }) {
                const result = await queryFulfilled;
                dispatch(setAudio(result.data.data));
            }

        }),
    }),
})

export default randomAyahSlice.reducer;
export const { useRandomArabicAyahQuery, useRandomAudioAyahQuery, useRandomEnglishAyahQuery } = randomAyahSlice;

