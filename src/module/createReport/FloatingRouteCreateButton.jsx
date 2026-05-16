// FloatingRouteCreateButton.jsx

import { useState } from "react";
import { useLocation } from "react-router-dom";

import CreateReportModal from "./CreateReportModal";

const FloatingRouteCreateButton = () => {
    const location = useLocation();

    const [open, setOpen] =
        useState(false);

    const allowedRoutes = [
        "/dashboard",
        "/students",
        "/",
        /^\/reports\?id=.+/,
    ];

    const currentRoute =
        `${location.pathname}${location.search}`;

    const shouldShow =
        allowedRoutes.some((route) => {
            if (typeof route === "string") {
                return route === currentRoute;
            }

            return route.test(currentRoute);
        });

    if (!shouldShow) return null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    zIndex: 9999,

                    padding: "10px 16px",

                    border: "none",
                    borderRadius: "8px",

                    background: "#111",
                    color: "#fff",

                    cursor: "pointer",
                }}
            >
                Create Report
            </button>

            <CreateReportModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default FloatingRouteCreateButton;