import { Outlet } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../footer.jsx";

const MainLayout = () => {
    return (
        <div className="public-site min-h-screen w-full bg-white flex flex-col">
            <Navbar />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
