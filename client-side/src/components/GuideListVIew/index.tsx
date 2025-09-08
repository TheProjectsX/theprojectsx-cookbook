import React from "react";
import { IoIosArrowForward } from "react-icons/io";

const GuideListView = ({
    guide,
}: {
    guide: { _id: string; category: string; tag: string; title: string };
}) => {
    return (
        <a
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
        </a>
    );
};

export default GuideListView;
