"use client";

import React, { useState } from "react";
import Title from "../components/title";
import { useFetchUsersQuery } from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";

const Users = () => {
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useFetchUsersQuery({});

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    if (isError) {
        console.log(error);
        return <div>Got Error</div>;
    }

    return (
        <>
            <Title content="Users Insight" />

            <section>
                <div className="overflow-x-auto scrollbar-thin bg-light-bg-secondary dark:bg-dark-bg-secondary not-dark:shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg transition-colors">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-400">
                        <thead className="bg-slate-100 dark:bg-slate-700 transition-colors">
                            <tr className="text-sm font-title">
                                <th className="py-3 px-6 font-medium whitespace-nowrap">
                                    Name
                                </th>
                                <th className="py-3 px-6 font-medium whitespace-nowrap">
                                    Email
                                </th>
                                <th className="py-3 px-6 font-medium whitespace-nowrap">
                                    Joined
                                </th>
                                <th className="py-3 px-6 font-medium whitespace-nowrap">
                                    Snippets
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center text-gray-500 dark:text-gray-300 max-sm:text-sm">
                            {response.data.map(
                                (user: {
                                    _id: string;
                                    name: string;
                                    email: string;
                                    createdAt: string;
                                    snippetCount: number;
                                }) => (
                                    <tr key={user._id}>
                                        <td className="py-3 px-6 whitespace-nowrap font-medium">
                                            {user.name}
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td
                                            className="py-3 px-6 whitespace-nowrap"
                                            title={new Date(
                                                user.createdAt
                                            ).toDateString()}
                                        >
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            {String(user.snippetCount).padStart(
                                                2,
                                                "0"
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default Users;
