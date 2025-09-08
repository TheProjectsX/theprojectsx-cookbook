"use client";

import RegisterInterface from "@/components/Authentication/sections/registerInterface";
import withoutAuth from "@/hoc/withoutAuth";

const Register = () => {
    return (
        <main className="flex items-center justify-center flex-1 px-5 py-10">
            <RegisterInterface />
        </main>
    );
};

export default withoutAuth(Register);
