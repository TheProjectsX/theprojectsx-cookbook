import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Categories
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/admin/categories",
                method: "POST",
                body: { ...data.body },
            }),
        }),
        fetchAdminCategories: builder.query({
            query: () => "/admin/categories",
        }),
        updateCategory: builder.mutation({
            query: (data) => ({
                url: `/admin/categories/${data.id}`,
                method: "PUT",
                body: { ...data.body },
            }),
        }),
        deleteCategory: builder.mutation({
            query: (data) => ({
                url: `/admin/categories/${data.id}`,
                method: "DELETE",
            }),
        }),

        // Guides
        createGuide: builder.mutation({
            query: (data) => ({
                url: "/admin/guides",
                method: "POST",
                body: { ...data.body },
            }),
        }),
        fetchGuide: builder.query({
            query: (data) => `/admin/guides/${data.id}`,
        }),
        updateGuide: builder.mutation({
            query: (data) => ({
                url: `/admin/guides/${data.id}`,
                method: "PUT",
                body: { ...data.body },
            }),
        }),
        deleteGuide: builder.mutation({
            query: (data) => ({
                url: `/admin/guides/${data.id}`,
                method: "DELETE",
            }),
        }),

        // Sections
        createSection: builder.mutation({
            query: (data) => ({
                url: `/admin/guides/${data.guideId}/sections`,
                method: "POST",
                body: { ...data.body },
            }),
        }),
        fetchSection: builder.query({
            query: (data) => `/admin/sections/${data.id}`,
        }),
        updateSection: builder.mutation({
            query: (data) => ({
                url: `/admin/sections/${data.id}`,
                method: "PUT",
                body: { ...data.body },
            }),
        }),
        deleteSection: builder.mutation({
            query: (data) => ({
                url: `/admin/sections/${data.id}`,
                method: "DELETE",
            }),
        }),

        // Avatars
        createAvatar: builder.mutation({
            query: (data) => ({
                url: `/admin/avatar`,
                method: "POST",
                body: { ...data.body },
            }),
        }),
        updateAvatar: builder.mutation({
            query: (data) => ({
                url: `/admin/avatar/${data.id}`,
                method: "PUT",
                body: { ...data.body },
            }),
        }),
        deleteAvatar: builder.mutation({
            query: (data) => ({
                url: `/admin/avatar/${data.id}`,
                method: "DELETE",
            }),
        }),

        // Users
        fetchUsers: builder.query({
            query: (data) => "/admin/users",
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useFetchAdminCategoriesQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useCreateGuideMutation,
    useFetchGuideQuery,
    useUpdateGuideMutation,
    useDeleteGuideMutation,
    useCreateSectionMutation,
    useFetchSectionQuery,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useCreateAvatarMutation,
    useUpdateAvatarMutation,
    useDeleteAvatarMutation,
    useFetchUsersQuery,
} = adminApiSlice;
