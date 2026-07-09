import { Route, Routes } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout";

import Home from "../../Pages/Home";
import About from "../../Pages/About";
import Mission from "../../Pages/Mission";
import Media from "../../Pages/Media";
import Reviews from "../../Pages/Reviews";
import Contact from "../../Pages/Contact";
import Donate from "../../Pages/Donate";
import Login from "../../Pages/login";
import Register from "../../Pages/Register";
import NotFound from "../../Pages/NotFound";

export default function Router() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/media" element={<Media />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
