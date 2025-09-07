"use client";

import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const withoutAuth = (WrappedComponent: any) => {
    return function ProtectedComponent(props: any) {
        const router = useRouter();

        const { data: userInfo, isLoading: isUserInfoLoading } = useSelector(
            (state: any) => state.user_info
        );

        useEffect(() => {
            if (userInfo) {
                router.push("/");
            }
        }, [userInfo]);

        if (isUserInfoLoading || userInfo) {
            return <LoadingPlaceholder />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withoutAuth;
