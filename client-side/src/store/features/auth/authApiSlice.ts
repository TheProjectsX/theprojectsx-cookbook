import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const authApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: { ...data.credentials },
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: { ...data.credentials },
            }),
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
    authApiSlice;
