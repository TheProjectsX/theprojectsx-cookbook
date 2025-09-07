import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const publicApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchGuide: builder.query({
            query: (data) => `/guides/${data.category}/${data.tag}`,
        }),
        fetchNavigation: builder.query({
            query: (data) => `/info/navigation`,
        }),
        fetchCategories: builder.query({
            query: (data) => `/info/categories`,
        }),
    }),
});

export const {
    useFetchGuideQuery,
    useFetchNavigationQuery,
    useFetchCategoriesQuery,
} = publicApiSlice;
