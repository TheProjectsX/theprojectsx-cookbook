"use client";

import { useEffect } from "react";
import LoginInterface from "./sections/loginInterface";
import RegisterInterface from "./sections/registerInterface";

export type AuthStatus = "login" | "register" | null;

const Authentication = ({
    status,
    setStatus,
}: {
    status: AuthStatus;
    setStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
}) => {
    // Prevent Scrolling
    useEffect(() => {
        document.body.style.overflow = status ? "hidden" : "auto";
    }, [status]);

    if (!status) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 cursor-pointer bg-slate-900/70 z-50"
            onClick={(e) => {
                if (e.currentTarget === e.target) {
                    setStatus(null);
                }
            }}
        >
            {status === "login" && <LoginInterface setStatus={setStatus} />}

            {status === "register" && (
                <RegisterInterface setStatus={setStatus} />
            )}
        </div>
    );
};

export default Authentication;
