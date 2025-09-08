import React from "react";

const Title = ({ content }: { content: string }) => {
    return (
        <h2 className="mb-5 text-2xl font-semibold sm:text-4xl font-title text-light-title dark:text-dark-title">
            {content}
        </h2>
    );
};

export default Title;
