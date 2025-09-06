import React from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
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

    return (
        <header className="py-2.5 px-3">
            <div className="flex justify-between items-center max-width">
                <div className="flex gap-2 items-center">
                    <button className="text-xl p-2 text-gray-700 hover:text-black hover:bg-slate-200 rounded-md cursor-pointer transition-colors">
                        <TbMenuDeep />
                    </button>

                    <div className="font-mono italic font-semibold text-xl">CookBook!</div>
                </div>

                <nav>
                    <ul className="flex text-sm gap-2 font-medium">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="px-2 py-1 hover:text-[dodgerBlue]">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <button>Login</button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
