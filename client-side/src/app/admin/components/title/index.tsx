import React from "react";

const Title = ({
    content,
    className = "",
}: {
    content: string;
    className?: string;
}) => {
    return (
        <h2
            className={`mb-5 text-2xl font-semibold sm:text-4xl font-title text-light-title dark:text-dark-title ${className}`}
        >
            {content}
        </h2>
    );
};

export default Title;
