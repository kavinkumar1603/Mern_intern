import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomeLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default HomeLayout;
