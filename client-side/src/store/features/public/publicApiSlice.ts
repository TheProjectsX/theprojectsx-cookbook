import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const publicApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchGuide: builder.query({
            query: (data) => `/guides/${data.category}/${data.tag}`,
        }),
        fetchGuides: builder.query({
            query: (data) => ({
                url: `/guides`,
                params: data.params,
            }),
        }),
        fetchNavigation: builder.query({
            query: (data) => `/info/navigation`,
        }),
        fetchCategories: builder.query({
            query: (data) => `/info/categories`,
        }),
        fetchAvatars: builder.query({
            query: (data) => "/info/avatars",
        }),
    }),
});

export const {
    useFetchGuideQuery,
    useFetchGuidesQuery,
    useFetchNavigationQuery,
    useFetchCategoriesQuery,
    useFetchAvatarsQuery,
} = publicApiSlice;
