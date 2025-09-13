"use client";

import { useFetchGuideByIdQuery } from "@/store/features/admin/adminApiSlice";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { toast } from "react-toastify";
import Title, { TitlePlaceholder } from "../../components/title";

const GuideDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();

    const { data, isLoading, isError, error } = useFetchGuideByIdQuery({ id });

    // Go back if error
    useEffect(() => {
        if (!isError) return;

        router.push("/admin/guides");
        toast.error(
            (error as any)?.data?.message || "Failed to load Guide Data"
        );
    }, [isError]);

    if (!data) {
        return (
            <>
                <TitlePlaceholder />
            </>
        );
    }

    return (
        <>
            <Title content={data.title} />
        </>
    );
};

export default GuideDetailsPage;
