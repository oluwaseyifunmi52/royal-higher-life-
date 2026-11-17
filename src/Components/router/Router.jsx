import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "../Layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Home from "../../Pages/Home";

const About = lazy(() => import("../../Pages/About"));
const Leadership = lazy(() => import("../../Pages/Leadership"));
const Sermons = lazy(() => import("../../Pages/Sermons"));
const SermonDetail = lazy(() => import("../../Pages/SermonDetail"));
const Events = lazy(() => import("../../Pages/Events"));
const CancelEventRegistration = lazy(() => import("../../Pages/CancelEventRegistration"));
const NewsletterUnsubscribe = lazy(() => import("../../Pages/NewsletterUnsubscribe"));
const Gallery = lazy(() => import("../../Pages/Gallery"));
const Mission = lazy(() => import("../../Pages/Mission"));
const Media = lazy(() => import("../../Pages/Media"));
const Reviews = lazy(() => import("../../Pages/Reviews"));
const Contact = lazy(() => import("../../Pages/Contact"));
const Donate = lazy(() => import("../../Pages/Donate"));
const DonationComplete = lazy(() => import("../../Pages/DonationComplete"));
const DonationTrack = lazy(() => import("../../Pages/DonationTrack"));
const Login = lazy(() => import("../../Pages/login"));
const Register = lazy(() => import("../../Pages/Register"));
const ForgotPassword = lazy(() => import("../../Pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("../../Pages/VerifyEmail"));
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
                    <Route path="/leadership" element={<Leadership />} />
                    <Route path="/sermons" element={<Sermons />} />
                    <Route path="/sermons/:id" element={<SermonDetail />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/cancel/:id" element={<CancelEventRegistration />} />
                    <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/mission" element={<Mission />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/donations/complete" element={<DonationComplete />} />
                    <Route path="/donations/track" element={<DonationTrack />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
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

                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Admin />
                        </AdminRoute>
                    }
                />
            </Routes>
        </Suspense>
    );
}
