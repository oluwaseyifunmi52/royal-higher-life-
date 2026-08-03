import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../../Pages/Home";

const About = lazy(() => import("../../Pages/About"));
const Mission = lazy(() => import("../../Pages/Mission"));
const Media = lazy(() => import("../../Pages/Media"));
const Reviews = lazy(() => import("../../Pages/Reviews"));
const Contact = lazy(() => import("../../Pages/Contact"));
const Donate = lazy(() => import("../../Pages/Donate"));
const Login = lazy(() => import("../../Pages/login"));
const Register = lazy(() => import("../../Pages/Register"));
const ForgotPassword = lazy(() => import("../../Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../../Pages/ResetPassword"));
const Dashboard = lazy(() => import("../../Pages/Dashboard"));
const Admin = lazy(() => import("../../Pages/Admin"));
const NotFound = lazy(() => import("../../Pages/NotFound"));

function PageFallback() {
    return <div className="page-fallback" role="status">Loading...</div>;
}

export default function Router() {
    return (
        <Suspense fallback={<PageFallback />}>
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
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/admin" element={<Admin />} />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
