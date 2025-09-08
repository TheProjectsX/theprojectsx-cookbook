import { GoRepoForked } from "react-icons/go";
import { MdCommit } from "react-icons/md";

const Footer = () => {
    const statsData = [
        {
            title: "Total Repositories",
            value: "100+",
            icon: GoRepoForked,
        },
        {
            title: "Total Contributions",
            value: 1500,
            icon: MdCommit,
        },
    ];

    return (
        <footer className="p-6 transition-colors border-t bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="mx-auto text-center max-width">
                <a
                    href="https://github.com/TheProjectsX"
                    target="_blank"
                    className="flex flex-col gap-0.5 font-semibold font-mono text-sm hover:text-primary text-gray-600 dark:text-gray-300 hover:text-highlight dark:hover:text-blue-500 w-fit mx-auto"
                >
                    <span>All Rights Reserved by TheProjectsX</span>
                    <span className="flex items-center justify-center gap-3">
                        {statsData.map((item) => (
                            <span
                                key={item.value}
                                className="flex items-center gap-1"
                            >
                                <item.icon />
                                {item.value}
                            </span>
                        ))}
                    </span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
