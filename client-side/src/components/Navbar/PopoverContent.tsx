import { AppDispatch } from "@/store/app/store";
import { useLogoutMutation } from "@/store/features/auth/authApiSlice";
import { removeUserInfo } from "@/store/features/user/userInfoSlice";
import Link from "next/link";
import { GoGear } from "react-icons/go";
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

const titleCase = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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
        <div className="bg-white dark:bg-slate-800 py-2 shadow-xl rounded-lg min-w-50 border border-slate-100 dark:border-slate-700">
            <div className="px-4">
                <p className="text-sm font-medium">
                    {titleCase(userInfo.role)}
                </p>
                <h3 className="text-lg font-semibold font-title">
                    {userInfo.name}
                </h3>
            </div>

            <hr className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2" />
            <Link
                href={"/me/edit"}
                className="w-full text-left hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-3 cursor-pointer flex items-center gap-2 click-effect text-sm"
            >
                <LiaUserEditSolid className="text-lg" /> Edit Profile
            </Link>

            <Link
                href={"/me/snippets"}
                className="w-full text-left hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-3 cursor-pointer flex items-center gap-2 click-effect text-sm"
            >
                <TbFolderCode className="text-lg" /> Snippets
            </Link>

            {userInfo.role === "admin" && (
                <>
                    <hr className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2" />
                    <Link
                        href={"/admin/dashboard"}
                        className="w-full text-left hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-3 cursor-pointer flex items-center gap-2 click-effect text-sm"
                    >
                        <GrUserAdmin className="text-lg" /> Admin Dashboard
                    </Link>
                </>
            )}

            <hr className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2" />

            <button
                className="w-full text-left hover:bg-gray-100 dark:hover:bg-slate-700 px-4 py-3 cursor-pointer flex items-center gap-2 click-effect text-sm"
                onClick={handleLogout}
            >
                <IoLogOutOutline className="text-lg" /> Logout
            </button>
        </div>
    );
};

export default PopoverContent;
