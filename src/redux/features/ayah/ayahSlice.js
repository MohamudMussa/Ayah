import apiSlice from "../api/apiSlice";
import { setAudio, setEnglish } from "../surah/surahSlice";

const ayahSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // arabicAyah: builder.query({
        //     query: ({ surah, ayah }) => `ayah/${surah}:${ayah}`,

        // }),
        englishAyah: builder.query({
            query: ({ surah, ayah }) => `ayah/${surah}:${ayah}/en.sahih`,
            async onQueryStarted(args, { queryFulfilled, dispatch }) {
                const result = await queryFulfilled;
                dispatch(setEnglish(result.data.data));
            }
        }),
        audioAyah: builder.query({
            query: ({ surah, ayah }) => `ayah/${surah}:${ayah}/ar.hudhaify`,
            async onQueryStarted(args, { queryFulfilled, dispatch }) {
                const result = await queryFulfilled;
                dispatch(setAudio(result.data.data));
            }
        }),
    }),
})

export default ayahSlice.reducer;
export const { useArabicAyahQuery, useAudioAyahQuery, useEnglishAyahQuery } = ayahSlice;

