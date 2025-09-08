"use client";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { AuthStatus } from "..";
import { useRegisterMutation } from "@/store/features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/app/store";
import { fetchUserInfoViaThunk } from "@/store/features/user/userInfoSlice";
import { toast } from "react-toastify";

const RegisterModal = ({
    setStatus,
}: {
    setStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
}) => {
    const [registerUser, { isLoading, isSuccess }] = useRegisterMutation();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const credentials = {
            name: form.fullname.value,
            email: form.email.value,
            password: form.password.value,
        };

        try {
            await registerUser({ credentials }).unwrap();
            await dispatch(fetchUserInfoViaThunk()).unwrap();

            setStatus(null)
            toast.success("Register SuccessFul!");
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message ?? "Failed to Register");
        }
    };

    return (
        <div className="max-w-[500px] w-full bg-white dark:bg-slate-800 p-5 rounded-md cursor-auto dark:border-slate-700 relative transition-colors">
            <h2 className="pb-3 mb-6 text-xl font-medium text-center border-b dark:border-slate-600">
                Create new Account
            </h2>

            {/* Credentials Login */}
            <form onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1 mb-4 font-medium text-gray-900 dark:text-white">
                    <p>Full Name</p>
                    <input
                        type="text"
                        name="fullname"
                        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-light-primary block w-full py-2.5 px-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white outline-none transition-colors"
                        placeholder="John Deo"
                        required
                    />
                </label>
                <label className="flex flex-col gap-1 mb-4 font-medium text-gray-900 dark:text-white">
                    <p>Email</p>
                    <input
                        type="email"
                        name="email"
                        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-light-primary block w-full py-2.5 px-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white outline-none transition-colors"
                        placeholder="johndeo@gmail.com"
                        required
                    />
                </label>
                <label className="relative flex flex-col gap-1 mb-5 font-medium text-gray-900 dark:text-white">
                    <p>Password</p>
                    <input
                        type="password"
                        name="password"
                        minLength={5}
                        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-light-primary block w-full py-2.5 px-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white outline-none transition-colors"
                        placeholder="********"
                        required
                    />

                    <button
                        type="button"
                        className="absolute right-1.5 bottom-[8px] text-xl dark:text-slate-200 hover:cursor-pointer p-1"
                        onClick={(e) => {
                            const target = (e.currentTarget ??
                                e.target) as HTMLButtonElement;

                            const input = target.parentElement?.querySelector(
                                "input"
                            )! as HTMLInputElement;

                            const showSpan = target.querySelector(
                                "span.show"
                            )! as HTMLSpanElement;
                            const hideSpan = target.querySelector(
                                "span.hide"
                            )! as HTMLSpanElement;

                            if (input.type === "password") {
                                showSpan.style.display = "none";
                                hideSpan.style.display = "inline";

                                input.type = "text";
                                input.placeholder = "Password";
                            } else {
                                hideSpan.style.display = "none";
                                showSpan.style.display = "inline";

                                input.type = "password";
                                input.placeholder = "********";
                            }
                        }}
                    >
                        <span className="show">
                            <AiOutlineEye />
                        </span>
                        <span className="hidden hide">
                            <AiOutlineEyeInvisible />
                        </span>
                    </button>
                </label>

                <button
                    type="submit"
                    className="w-full py-2 font-medium text-white rounded-md cursor-pointer bg-light-primary hover:bg-blue-700 click-effect disabled:cursor-not-allowed disabled:opacity-80"
                    disabled={isLoading || isSuccess}
                >
                    Register
                </button>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-1 py-6">
                <span className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-500"></span>
                <span className="text-sm font-medium">OR</span>
                <span className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-500"></span>
            </div>

            {/* Google Login */}
            <button className="flex items-center justify-center gap-2 w-full dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer transition-colors">
                <FcGoogle className="text-xl" />{" "}
                <span className="font-medium dark:text-gray-100">
                    Continue with Google
                </span>
            </button>

            {/* Already have an Account */}
            <div className="pt-5 pl-1">
                <p className="text-sm font-medium">
                    Already Have an Account?{" "}
                    <button
                        onClick={() => setStatus("login")}
                        className="text-light-primary dark:text-[dodgerBlue] hover:underline underline-offset-4 cursor-pointer"
                    >
                        Login Now!
                    </button>
                </p>
            </div>

            {/* Close Button */}
            <button
                className="absolute p-1 text-lg rounded-full cursor-pointer right-3 top-3 bg-slate-200 dark:bg-slate-700"
                onClick={() => setStatus(null)}
            >
                <IoMdClose />
            </button>
        </div>
    );
};

export default RegisterModal;
