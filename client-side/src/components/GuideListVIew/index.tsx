"use client";

import Link from "next/link";
import React from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

const GuideListView = ({
    guide,
    onEdit,
}: {
    guide: { _id: string; category: string; tag: string; title: string };
    onEdit?: () => void;
}) => {
    return (
        <div className="relative">
            <Link
                href={`/${guide.category.toLowerCase()}/${guide.tag.toLowerCase()}`}
                className="block px-6 py-4 rounded-lg cursor-pointer hover:scale-[101%] transition-[scale,background-color] duration-200 bg-light-bg-secondary dark:bg-dark-bg-secondary not-dark:shadow-lg"
            >
                <p className="flex items-center gap-1 mb-1 text-sm">
                    <span className="text-light-highlight dark:text-dark-highlight">
                        {guide.category}
                    </span>
                    <span>
                        <IoIosArrowForward className="text-light-title dark:text-dark-title " />
                    </span>
                    <span className="text-light-highlight dark:text-dark-highlight">
                        {guide.tag}
                    </span>
                </p>
                <h3 className="text-lg font-semibold sm:text-xl text-light-title dark:text-dark-title font-title line-clamp-1">
                    {guide.title}
                </h3>
            </Link>
            {onEdit && (
                <button
                    className="absolute p-2 text-lg rounded-full cursor-pointer right-3 top-3 bg-slate-200 dark:bg-slate-700 z-10 hover:text-light-highlight dark:hover:text-dark-highlight"
                    onClick={onEdit}
                >
                    <FiEdit3 />
                </button>
            )}
        </div>
    );
};

export default GuideListView;

export const GuideListViewSkeleton = () => {
    return (
        <div className="px-6 py-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary not-dark:shadow-lg">
            <p className="flex items-center gap-1 mb-2.5 text-sm">
                <span className="h-4 rounded-lg w-18 bg-slate-600 animate-pulse"></span>
                <span>
                    <IoIosArrowForward className="text-light-title dark:text-dark-title " />
                </span>
                <span className="h-4 rounded-lg w-18 bg-slate-600 animate-pulse"></span>
            </p>
            <p className="w-2/5 h-6 rounded-lg bg-slate-600 animate-pulse"></p>
        </div>
    );
};
