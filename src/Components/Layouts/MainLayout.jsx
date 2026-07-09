import { Outlet } from "react-router-dom";
import Header from "../Header.jsx";
import Footer from "../footer.jsx";

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;