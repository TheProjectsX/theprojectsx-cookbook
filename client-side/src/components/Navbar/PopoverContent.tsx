import { AppDispatch } from "@/store/app/store";
import { useLogoutMutation } from "@/store/features/auth/authApiSlice";
import { removeUserInfo } from "@/store/features/user/userInfoSlice";
import { capitalizeText } from "@/utils/transform";
import Link from "next/link";
import { GrUserAdmin } from "react-icons/gr";
import { IoLogOutOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbFolderCode } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export type UserInfo = {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
};

const PopoverContent = ({ userInfo }: { userInfo: UserInfo }) => {
    const [logoutUser] = useLogoutMutation();

    const dispatch = useDispatch<AppDispatch>();
    const handleLogout = async () => {
        try {
            await logoutUser({});
            dispatch(removeUserInfo());
            toast.success("Logout Successful!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Logout Failed");
        }
    };

    return (
        <div className="py-2 bg-white border rounded-lg shadow-xl dark:bg-slate-800 min-w-50 border-slate-100 dark:border-slate-700">
            <div className="px-4">
                <p className="text-sm font-medium">
                    {capitalizeText(userInfo.role)}
                </p>
                <h3 className="text-lg font-semibold font-title">
                    {userInfo.name}
                </h3>
            </div>

            <hr className="pt-2 mt-2 border-t border-gray-300 dark:border-gray-600" />
            <Link
                href={"/me/edit"}
                className="flex items-center w-full gap-2 px-4 py-3 text-sm text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 click-effect"
            >
                <LiaUserEditSolid className="text-lg" /> Edit Profile
            </Link>

            <Link
                href={"/me/snippets"}
                className="flex items-center w-full gap-2 px-4 py-3 text-sm text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 click-effect"
            >
                <TbFolderCode className="text-lg" /> Snippets
            </Link>

            {userInfo.role === "admin" && (
                <>
                    <hr className="pt-2 mt-2 border-t border-gray-300 dark:border-gray-600" />
                    <Link
                        href={"/admin/dashboard"}
                        className="flex items-center w-full gap-2 px-4 py-3 text-sm text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 click-effect"
                    >
                        <GrUserAdmin className="text-lg" /> Admin Dashboard
                    </Link>
                </>
            )}

            <hr className="pt-2 mt-2 border-t border-gray-300 dark:border-gray-600" />

            <button
                className="flex items-center w-full gap-2 px-4 py-3 text-sm text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 click-effect"
                onClick={handleLogout}
            >
                <IoLogOutOutline className="text-lg" /> Logout
            </button>
        </div>
    );
};

export default PopoverContent;
