import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.alquran.cloud/v1' }),
    endpoints: (builder) => ({
        getSurah: builder.query({
            query: () => `/surah`,
        }),
    }),

})

export const { useGetSurahQuery } = apiSlice;

export default apiSlice;
