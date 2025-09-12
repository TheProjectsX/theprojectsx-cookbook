"use client";

import store from "@/store/app/store";
import { Provider } from "react-redux";
import { Bounce, ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import Navbar from "../Navbar";
import Footer from "../Footer";

const ApplicationWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <NextTopLoader showSpinner={false} color="dodgerBlue" height={2} />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
            />

            <Provider store={store}>
                <Navbar />

                {children}

                <Footer />
            </Provider>
        </>
    );
};

export default ApplicationWrapper;
