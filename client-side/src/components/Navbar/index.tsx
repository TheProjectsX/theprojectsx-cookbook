"use client";

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
import NavLink from "../NavLink";
import Link from "next/link";

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

            <header className="px-3 py-3.5">
                {/* Logo and Ham */}
                <div className="flex items-center justify-between mx-auto max-width">
                    <div className="flex items-center gap-2">
                        <button className="text-2xl p-1.5 text-gray-500 hover:text-black bg-light-bg-secondary dark:bg-dark-bg-secondary dark:text-gray-400 dark:hover:text-white not-dark:shadow-lg rounded-md cursor-pointer click-effect !transition-all">
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
                    <nav className="hidden px-2 transition-colors md:block bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-3xl not-dark:shadow-lg">
                        <ul className="flex font-medium [&_.active]:text-light-highlight [&_.active]:dark:text-dark-highlight">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <NavLink
                                        href={link.href}
                                        className="block px-4 py-2 hover:text-light-highlight dark:hover:text-dark-highlight"
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Theme and Login */}
                    <div className="flex items-center px-2 transition-colors not-dark:shadow-lg bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-3xl">
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
