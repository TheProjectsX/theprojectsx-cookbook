"use client";

import LoginInterface from "@/components/Authentication/sections/loginInterface";
import withoutAuth from "@/hoc/withoutAuth";

const Login = () => {
    return (
        <main className="flex items-center justify-center flex-1 px-5 py-10">
            <LoginInterface />
        </main>
    );
};

export default withoutAuth(Login);
