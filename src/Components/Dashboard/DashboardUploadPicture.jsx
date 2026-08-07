import { useState, useRef } from "react";
import api from "../../api/axios.js";

export default function DashboardUploadPicture() {
    const [status, setStatus] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!selectedFile) {
            setStatus({ type: "error", text: "Please select an image to upload." });
            return;
        }

        setStatus({ type: "loading", text: "Uploading picture..." });

        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        try {
            await api.post("/api/auth/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSelectedFile(null);
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setStatus({ type: "success", text: "Profile picture updated successfully!" });
        } catch (error) {
            setStatus({ type: "error", text: error.message });
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Profile Picture</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center">
                    {preview && (
                        <div className="mb-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                            />
                        </div>
                    )}
                    <label
                        htmlFor="profilePicture"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Select Image
                    </label>
                    <input
                        ref={fileInputRef}
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={status?.type === "loading" || !selectedFile}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {status?.type === "loading" ? "Uploading..." : "Upload Picture"}
                </button>
                {status && (
                    <div
                        className={`p-3 rounded-md ${
                            status.type === "success"
                                ? "bg-green-100 text-green-700"
                                : status.type === "error"
                                ? "bg-red-100 text-red-700"
                                : ""
                        }`}
                        role="status"
                        aria-live="polite"
                    >
                        {status.text}
                    </div>
                )}
            </form>
        </div>
    );
}
