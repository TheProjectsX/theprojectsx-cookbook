import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const authApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: "/auth/register",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: { ...credentials },
            }),
        }),
        logout: builder.query({
            query: (data) => "/auth/logout",
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutQuery } =
    authApiSlice;
