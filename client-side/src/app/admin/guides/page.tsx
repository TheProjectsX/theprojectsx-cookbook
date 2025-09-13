"use client";

import { useEffect, useState } from "react";
import Title, { TitlePlaceholder } from "../components/title";
import Pagination from "@/components/Pagination";
import GuideListView, {
    GuideListViewSkeleton,
} from "@/components/GuideListVIew";
import {
    useFetchCategoriesQuery,
    useFetchGuidesQuery,
} from "@/store/features/public/publicApiSlice";
import ManageGuide from "../guides/Manage";

import Swal from "sweetalert2";
import { useDeleteGuideMutation } from "@/store/features/admin/adminApiSlice";
import { toast } from "react-toastify";

const Guides = () => {
    const [manageGuide, setManageGuide] = useState<null | { id?: string }>(
        null
    );

    const [params, setParams] = useState<Record<any, any>>();
    const { data: response, refetch } = useFetchGuidesQuery({
        params,
    });

    const { data: categoriesResponse } = useFetchCategoriesQuery({});
    const [deleteGuide] = useDeleteGuideMutation();

    const [currentPage, setCurrentPage] = useState<number>(1);

    // On Page Change
    useEffect(() => {
        setParams((prev) => ({ ...prev, page: currentPage }));
    }, [currentPage]);

    // Handle Delete Guide
    const handleDeleteGuide = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Guide will be Permanently Deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await deleteGuide({ id });
            refetch();
            toast.success(response.data.message);
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Something went wrong!");
        }
    };

    return (
        <>
            <ManageGuide
                status={manageGuide}
                setStatus={setManageGuide}
                refetch={refetch}
                categories={categoriesResponse?.data ?? []}
            />

            <div className="flex items-center justify-between gap-3 mb-5">
                <Title content="Latest Guides" className="!mb-0" />

                <div className="flex items-center gap-4">
                    <div>Filters</div>
                    <div>
                        <button
                            className="w-full py-2 px-4 font-medium text-white rounded-md cursor-pointer bg-highlight hover:bg-blue-700 click-effect disabled:cursor-not-allowed disabled:opacity-80"
                            onClick={() => setManageGuide({})}
                        >
                            Add New
                        </button>
                    </div>
                </div>
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
                                onDelete={() => handleDeleteGuide(guide._id)}
                                admin
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
