"use client";

import {
    useCreateGuideMutation,
    useFetchGuideByIdQuery,
    useUpdateGuideMutation,
} from "@/store/features/admin/adminApiSlice";
import ReactSelect from "@theprojectsx/react-select";
import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

const ManageGuide = ({
    status,
    setStatus,
    refetch,
    categories,
}: {
    status: null | { id?: string };
    setStatus: React.Dispatch<React.SetStateAction<null | { id?: string }>>;
    refetch: () => void;
    categories: {
        _id: string;
        name: string;
    }[];
}) => {
    const { data, isLoading, isError, error } = useFetchGuideByIdQuery(
        { id: status?.id },
        { skip: !status?.id }
    );
    const [createGuide, { isLoading: createLoading }] =
        useCreateGuideMutation();
    const [updateGuide, { isLoading: updateLoading }] =
        useUpdateGuideMutation();

    useEffect(() => {
        document.body.style.overflow = status ? "hidden" : "auto";
    }, [status]);

    // If Error occurred
    useEffect(() => {
        if (!isError) return;

        const errorMessage =
            (error as any)?.data?.message || "Failed to load Guide Data";

        toast.error(errorMessage);
        setStatus(null);
    }, [isError]);

    if (!status) return <></>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const body = {
            category: form.category.value,
            tag: form.tag.value,
            title: (form.title as any).value,
        };

        try {
            let response;
            if (status.id) {
                response = await updateGuide({ id: status.id, body }).unwrap();
            } else {
                response = await createGuide({ body }).unwrap();
            }

            refetch();
            toast.success(response.message);
            setStatus(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Something was wrong");
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 cursor-pointer bg-slate-900/70 z-50"
            onClick={(e) => {
                if (e.currentTarget == e.target) {
                    setStatus(null);
                }
            }}
        >
            <div className="max-w-[500px] w-full bg-light-bg-secondary dark:bg-dark-bg-secondary p-5 rounded-md cursor-auto dark:border-slate-700 relative transition-colors not-dark:shadow-lg">
                <h2 className="pb-3 mb-6 text-xl font-medium text-center border-b dark:border-slate-600">
                    {status.id ? "Edit Guide" : "Create new Guide"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-1 mb-4 font-medium text-gray-900 dark:text-white">
                        <p>Category</p>
                        <ReactSelect
                            name="category"
                            options={categories.map((item) => ({
                                label: item.name,
                                value: item.name,
                            }))}
                            defaultValue={
                                data?.category
                                    ? {
                                          label: data.category,
                                          value: data.category,
                                      }
                                    : {
                                          label: categories[0].name,
                                          value: categories[0].name,
                                      }
                            }
                            isSearchable={false}
                            isClearable={false}
                        />
                    </label>

                    <label className="flex flex-col gap-1 mb-4 font-medium text-gray-900 dark:text-white">
                        <p>Tag</p>
                        <input
                            type="text"
                            name="tag"
                            className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-light-primary block w-full py-2.5 px-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white outline-none transition-colors disabled:opacity-75"
                            placeholder="ReactJS"
                            disabled={!!status.id && isLoading}
                            defaultValue={data?.tag}
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-1 mb-5 font-medium text-gray-900 dark:text-white">
                        <p>Title</p>
                        <input
                            type="text"
                            name="title"
                            className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-light-primary block w-full py-2.5 px-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white outline-none transition-colors disabled:opacity-75"
                            placeholder="How to use React JS"
                            disabled={!!status.id && isLoading}
                            defaultValue={data?.title}
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full py-2 font-medium text-white rounded-md cursor-pointer bg-highlight hover:bg-blue-700 click-effect disabled:cursor-not-allowed disabled:opacity-80"
                        disabled={createLoading || updateLoading}
                    >
                        {status.id ? "Update" : "Create"}
                    </button>
                </form>

                <button
                    className="absolute p-1 text-lg rounded-full cursor-pointer right-3 top-3 bg-slate-200 dark:bg-slate-700"
                    onClick={() => setStatus(null)}
                >
                    <IoMdClose />
                </button>
            </div>
        </div>
    );
};

export default ManageGuide;
