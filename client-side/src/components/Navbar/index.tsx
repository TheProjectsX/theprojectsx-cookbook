"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { TbMenuDeep } from "react-icons/tb";

const Navbar = () => {
    const navLinks = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Snippets",
            href: "/snippets",
        },
        {
            label: "Resources",
            href: "/resources",
        },
    ];
    const pathname = usePathname();
    const router = useRouter();

    return (
        <header className="py-2.5 px-3 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 transition-colors">
            <div className="flex justify-between items-center max-width mx-auto">
                <div className="flex gap-2 items-center">
                    <button className="text-xl p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md cursor-pointer click-effect !transition-all">
                        <TbMenuDeep />
                    </button>

                    <div className="font-mono italic font-semibold text-xl">
                        CookBook!
                    </div>
                </div>

                <nav>
                    <ul className="flex text-sm font-medium">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="px-3.5 py-1.5 hover:text-light-primary"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        data-theme="dark"
                        className="text-xl p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md cursor-pointer transition-colors"
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

                                document.documentElement.classList.add("dark");
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
                        <span className="dark hidden">
                            <MdDarkMode />
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            if (
                                pathname !== "/login" &&
                                pathname !== "/register"
                            ) {
                                router.push("/login");
                            }
                        }}
                        className="bg-light-primary text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer click-effect"
                    >
                        Login
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
