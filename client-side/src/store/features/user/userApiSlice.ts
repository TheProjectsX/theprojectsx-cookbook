import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const userApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUserInfo: builder.query({ query: () => "/me" }),
        fetchCategories: builder.query({
            query: () => "/me/snippets/categories",
        }),
        createSnippet: builder.mutation({
            query: (data) => ({
                url: "/me/snippets",
                method: "POST",
                body: { ...data.body },
            }),
        }),
        fetchSnippets: builder.query({
            query: (data) => ({
                url: "/me/snippets",
                params: data.params ?? {},
            }),
        }),
        updateSnippet: builder.mutation({
            query: (data) => ({
                url: `/me/snippets/${data.id}`,
                method: "PUT",
                body: { ...data.body },
            }),
        }),
        deleteSnippet: builder.mutation({
            query: (data) => ({
                url: `/me/snippets/${data.id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useFetchUserInfoQuery,
    useFetchCategoriesQuery,
    useCreateSnippetMutation,
    useFetchSnippetsQuery,
    useUpdateSnippetMutation,
    useDeleteSnippetMutation,
} = userApiSlice;
