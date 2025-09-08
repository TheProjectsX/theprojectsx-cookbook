import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex-1 w-full px-3 py-4 mx-auto max-width">{children}</main>
    );
};

export default layout;
