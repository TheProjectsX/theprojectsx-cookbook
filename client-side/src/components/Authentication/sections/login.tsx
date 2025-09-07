"use client";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { AuthStatus } from "..";
import { useLoginMutation } from "@/store/features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/app/store";
import { toast } from "react-toastify";
import { fetchUserInfoViaThunk } from "@/store/features/user/userInfoSlice";

const LoginModal = ({
    setStatus,
}: {
    setStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
}) => {
    const [loginUser, { isLoading, isSuccess }] = useLoginMutation();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        const credentials = {
            email: form.email.value,
            password: form.password.value,
        };

        if (
            !credentials.email ||
            credentials.email?.length < 5 ||
            !credentials.password ||
            credentials.password?.length < 6
        ) {
            toast.error("Invalid Credentials");
            return;
        }

        try {
            await loginUser({ credentials }).unwrap();
            await dispatch(fetchUserInfoViaThunk()).unwrap();

            setStatus(null);
            toast.success("Login SuccessFul!");
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message ?? "Failed to Login");
        }
    };

    return (
        <div className="max-w-[500px] w-full bg-white dark:bg-slate-800 p-5 rounded-md cursor-auto border-2 border-slate-200 dark:border-slate-700 relative transition-colors">
            <h2 className="text-center text-xl font-medium pb-3 mb-6 border-b dark:border-slate-600">
                Login to Your Account
            </h2>

            {/* Credentials Login */}
            <form onSubmit={handleSubmit}>
                <label className="font-medium text-gray-900 dark:text-white flex flex-col gap-1 mb-4">
                    <p>Email</p>
                    <input
                        type="email"
                        name="email"
                        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:border-light-primary block w-full py-2.5 px-3 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white outline-none transition-colors"
                        placeholder="johndeo@gmail.com"
                        required
                    />
                </label>
                <label className="font-medium text-gray-900 dark:text-white flex flex-col gap-1 relative mb-5">
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
                        <span className="hide hidden">
                            <AiOutlineEyeInvisible />
                        </span>
                    </button>
                </label>

                <button
                    type="submit"
                    className="w-full bg-light-primary hover:bg-blue-700 py-2 rounded-md font-medium cursor-pointer text-white click-effect disabled:cursor-not-allowed disabled:opacity-80"
                    disabled={isLoading || isSuccess}
                >
                    Login
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
                    Don't Have an Account?{" "}
                    <button
                        onClick={() => setStatus("register")}
                        className="text-light-primary dark:text-[dodgerBlue] hover:underline underline-offset-4 cursor-pointer"
                    >
                        Register Now!
                    </button>
                </p>
            </div>

            {/* Close Button */}
            <button
                className="absolute right-3 top-3 text-lg bg-slate-200 dark:bg-slate-700 p-1 rounded-full cursor-pointer"
                onClick={() => setStatus(null)}
            >
                <IoMdClose />
            </button>
        </div>
    );
};

export default LoginModal;
