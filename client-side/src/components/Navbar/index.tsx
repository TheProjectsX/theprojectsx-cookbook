"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { TbMenuDeep } from "react-icons/tb";
import Authentication, { AuthStatus } from "../Authentication";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/app/store";
import { fetchUserInfoViaThunk } from "@/store/features/user/userInfoSlice";
import Popover from "@theprojectsx/react-popover";
import PopoverContent from "./PopoverContent";

const Navbar = () => {
    const commonNavLinks = [
        {
            label: "Home",
            href: "/",
        },
    ];

    const publicNavLinks = [
        {
            label: "Snippets",
            href: "/snippets",
        },
        {
            label: "Resources",
            href: "/resources",
        },
    ];

    const adminNavLinks = [
        {
            label: "Users",
            href: "/admin/users",
        },
        {
            label: "Guides",
            href: "/admin/guides",
        },
        {
            label: "Sections",
            href: "/admin/sections",
        },
    ];

    const [authStatus, setAuthStatus] = useState<AuthStatus>(null);

    const pathname = usePathname();
    const router = useRouter();

    const { data: userInfo, isLoading: isUserInfoLoading } = useSelector(
        (state: any) => state.user_info
    );

    const dispatch = useDispatch<AppDispatch>();

    // Fetch User Info
    useEffect(() => {
        dispatch(fetchUserInfoViaThunk());
    }, [dispatch]);

    const navLinks = [
        ...commonNavLinks,
        ...(userInfo && pathname.startsWith("/admin")
            ? adminNavLinks
            : publicNavLinks),
    ];

    return (
        <>
            <Authentication status={authStatus} setStatus={setAuthStatus} />

            <header className="py-2.5 px-3">
                {/* Logo and Ham */}
                <div className="flex items-center justify-between mx-auto max-width">
                    <div className="flex items-center gap-2">
                        <button className="text-2xl p-1.5 text-gray-500 hover:text-black bg-white dark:bg-slate-700 dark:text-gray-400 dark:hover:text-white shadow-lg rounded-md cursor-pointer click-effect !transition-all">
                            <TbMenuDeep />
                        </button>

                        <Link
                            href="/"
                            className="font-mono text-xl italic font-semibold"
                        >
                            CookBook!
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="px-2 bg-white shadow-lg dark:bg-slate-700 rounded-3xl">
                        <ul className="flex font-medium transition-colors">
                            {navLinks.map(
                                (link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="block px-4 py-2 hover:text-light-primary dark:hover:text-dark-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </nav>

                    {/* Theme and Login */}
                    <div className="flex items-center px-2 transition-colors bg-white shadow-lg dark:bg-slate-700 rounded-3xl">
                        <button
                            data-theme="dark"
                            className="p-2 text-2xl text-gray-500 transition-colors rounded-md cursor-pointer hover:text-black dark:text-gray-400 dark:hover:text-white"
                            onClick={(e) => {
                                const target = (e.currentTarget ||
                                    e.target) as HTMLButtonElement;

                                const theme = target.dataset.theme;

                                const lightSpan = target.querySelector(
                                    "span.light"
                                )! as HTMLSpanElement;
                                const darkSpan = target.querySelector(
                                    "span.dark"
                                )! as HTMLSpanElement;

                                if (theme === "light") {
                                    darkSpan.style.display = "none";
                                    lightSpan.style.display = "inline";

                                    target.dataset.theme = "dark";

                                    document.documentElement.classList.add(
                                        "dark"
                                    );
                                } else {
                                    lightSpan.style.display = "none";
                                    darkSpan.style.display = "inline";

                                    target.dataset.theme = "light";
                                    document.documentElement.classList.remove(
                                        "dark"
                                    );
                                }
                            }}
                        >
                            <span className="light">
                                <MdLightMode />
                            </span>
                            <span className="hidden dark">
                                <MdDarkMode />
                            </span>
                        </button>

                        {!isUserInfoLoading && !userInfo && (
                            <button
                                onClick={() => {
                                    if (
                                        pathname !== "/login" &&
                                        pathname !== "/register"
                                    ) {
                                        setAuthStatus("login");
                                    }
                                    if (pathname === "/register") {
                                        router.push("/login");
                                    }
                                }}
                                className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white px-3 py-1.5 rounded-md font-medium cursor-pointer click-effect"
                            >
                                Login
                            </button>
                        )}

                        {!isUserInfoLoading && userInfo && (
                            <Popover
                                content={<PopoverContent userInfo={userInfo} />}
                                position="bottom"
                                axis="right"
                                parentStyles={{
                                    height: "2.25rem",
                                }}
                            >
                                <button className="pl-2 cursor-pointer click-effect">
                                    <img
                                        src={userInfo.avatar}
                                        alt="User Avatar"
                                        className="rounded-full size-9"
                                    />
                                </button>
                            </Popover>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
