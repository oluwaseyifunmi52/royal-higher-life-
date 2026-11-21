import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();

    // The token-based reset page is legacy. The OTP-based flow lives in
    // ForgotPassword.jsx, which handles email entry, code delivery, and
    // password reset in a single page. Redirect any legacy token-based
    // reset links to the OTP flow.
    useEffect(() => {
        navigate("/forgot-password", { replace: true });
    }, [navigate]);

    return null;
}
