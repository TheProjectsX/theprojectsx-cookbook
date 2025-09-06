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
        <footer className="bg-slate-100 dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 transition-colors">
            <div className="max-width mx-auto text-center">
                <a
                    href="https://github.com/TheProjectsX"
                    target="_blank"
                    className="flex flex-col gap-0.5 font-semibold font-mono text-sm hover:text-primary text-gray-600 dark:text-gray-300 hover:text-light-primary dark:hover:text-blue-500 w-fit mx-auto"
                >
                    <span>All Rights Reserved by TheProjectsX</span>
                    <span className="flex gap-3 items-center justify-center">
                        {statsData.map((item) => (
                            <span
                                key={item.value}
                                className="flex gap-1 items-center"
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
