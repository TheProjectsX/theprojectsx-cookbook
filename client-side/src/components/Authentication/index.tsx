import LoginModal from "./sections/login";
import RegisterModal from "./sections/register";

export type AuthStatus = "login" | "register" | null;

const Authentication = ({
    status,
    setStatus,
}: {
    status: AuthStatus;
    setStatus: React.Dispatch<React.SetStateAction<AuthStatus>>;
}) => {
    if (!status) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 cursor-pointer bg-slate-700/50"
            onClick={(e) => {
                if (e.currentTarget === e.target) {
                    setStatus(null);
                }
            }}
        >
            {status === "login" && <LoginModal setStatus={setStatus} />}

            {status === "register" && <RegisterModal setStatus={setStatus} />}
        </div>
    );
};

export default Authentication;
