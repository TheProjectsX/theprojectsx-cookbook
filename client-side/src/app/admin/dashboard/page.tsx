import React from "react";
import Title from "../components/title";
import { capitalizeText, objToArray } from "@/utils/transform";
import GuideListView from "@/components/GuideListVIew";

const AdminDashboard = () => {
    const statistics = {
        success: true,
        statusCode: 200,
        message: "Data Parsed Successfully",
        countOverview: {
            guides: 2,
            categories: 2,
            sections: 2,
            snippets: 2,
            users: 2,
        },
        guidesByCategory: [
            {
                count: 2,
                category: "Frontend",
            },
        ],
        latestGuides: [
            {
                _id: "68a8b6bc18fee896f00c9600",
                category: "Frontend",
                tag: "React - Next",
                title: "Cookbook for React - Text Application",
            },
            {
                _id: "68a8b41208a9524426f0bdb5",
                category: "Frontend",
                tag: "React",
                title: "Cookbook for React Application",
            },
        ],
    };

    return (
        <>
            <Title content="Quick Overview" />

            {/* Count */}
            <section className="px-6 pt-4 pb-5 mb-5 transition-colors rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary not-dark:shadow-lg">
                <h3 className="mb-2.5 text-xl font-medium">
                    Amount Statistics
                </h3>
                <div className="grid grid-cols-2 min-[525px]:grid-cols-3 gap-5 min-[750px]:grid-cols-5">
                    {objToArray(statistics.countOverview).map((item) => (
                        <div
                            key={item.label}
                            className="text-center max-[525px]:last-of-type:odd:col-span-full"
                        >
                            <p className="mb-1 text-4xl font-semibold text-light-title dark:text-dark-title font-title">
                                {String(item.value).padStart(2, "0")}
                            </p>
                            <h4 className="text-sm font-medium">
                                Total {capitalizeText(item.label)}
                            </h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Guides By Category */}
            <section className="px-6 pt-4 pb-5 mb-5 transition-colors rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary not-dark:shadow-lg">
                <h3 className="mb-2.5 text-xl font-medium">
                    Guides Statistics
                </h3>
                <div className="grid grid-cols-2 min-[525px]:grid-cols-3 gap-5 min-[750px]:grid-cols-5">
                    {statistics.guidesByCategory.map((item) => (
                        <div
                            key={item.category}
                            className="text-center max-[525px]:last-of-type:odd:col-span-full"
                        >
                            <p className="mb-1 text-4xl font-semibold text-light-title dark:text-dark-title font-title">
                                {String(item.count).padStart(2, "0")}
                            </p>
                            <h4 className="font-medium">
                                {capitalizeText(item.category)}
                            </h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest Guides */}
            <section className="pt-4 pb-5">
                <h3 className="px-6 mb-2.5 text-xl font-medium">
                    Latest Guides
                </h3>

                <div className="space-y-3">
                    {statistics.latestGuides.map((guide) => (
                        <GuideListView key={guide._id} guide={guide} />
                    ))}
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;
