"use client";

import { useEffect, useState } from "react";
import Title from "../components/title";
import Pagination from "@/components/Pagination";
import GuideListView, {
    GuideListViewSkeleton,
} from "@/components/GuideListVIew";
import {
    useFetchCategoriesQuery,
    useFetchGuidesQuery,
} from "@/store/features/public/publicApiSlice";
import ManageGuide from "../guides/Manage";

const Guides = () => {
    const [manageGuide, setManageGuide] = useState<null | { id?: string }>(
        null
    );

    const [params, setParams] = useState<Record<any, any>>({
        limit: 1,
    });
    const { data: response, refetch } = useFetchGuidesQuery({
        params,
    });

    const { data: categoriesResponse } = useFetchCategoriesQuery({});

    const [currentPage, setCurrentPage] = useState<number>(1);

    // On Page Change
    useEffect(() => {
        setParams((prev) => ({ ...prev, page: currentPage }));
    }, [currentPage]);

    return (
        <>
            <ManageGuide
                status={manageGuide}
                setStatus={setManageGuide}
                refetch={refetch}
            />

            <div className="flex items-center justify-between gap-3 mb-5">
                <Title content="Latest Guides" className="!mb-0" />

                <div>Filters</div>
            </div>

            <section className="mb-8 space-y-3">
                {!response?.data &&
                    Array.from({ length: 2 }, (_, i) => i + 1).map((i) => (
                        <GuideListViewSkeleton key={i} />
                    ))}

                {response?.data &&
                    response.data.map(
                        (guide: {
                            _id: string;
                            category: string;
                            title: string;
                            tag: string;
                        }) => (
                            <GuideListView
                                key={guide._id}
                                guide={guide}
                                onEdit={() =>
                                    setManageGuide({
                                        id: guide._id,
                                    })
                                }
                            />
                        )
                    )}
            </section>
            <div className="flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                        (response?.pagination?.total_count ?? 1) /
                            (response?.pagination?.limit ?? 1)
                    )}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </>
    );
};

export default Guides;
