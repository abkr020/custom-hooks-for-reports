import { useState } from "react";
import ApiResponseDataDisplay from "./ApiResponseDataDisplay";
import CreateTableColumnsAndMapping from "./CreateTableColumnsAndMapping";
import useReportFetchWithFilter from "../../hooks/useReportFetchWithFilter";

const CreateReportModal = ({ open, onClose }) => {
    const [inputUrl, setInputUrl] = useState(
        `${import.meta.env.VITE_BACKEND_URL}/reports/students`
    );
    
    const { data, loading, error } = useReportFetchWithFilter({
        baseUrl: inputUrl,
        columns: [],
        filters: [],
        limit: 1,
    });
    
    
    if (!open) return null;
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(10,10,10,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
            }}
        >
            {/* MODAL CONTAINER */}
            <div
                style={{
                    width: "90%",
                    maxWidth: "1100px",
                    height: "80vh",
                    background: "#151515",
                    color: "#e6e6e6",
                    borderRadius: "12px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    border: "1px solid #2a2a2a",
                }}
            >
                {/* HEADER */}
                <div
                    style={{
                        padding: "14px 18px",
                        borderBottom: "1px solid #2a2a2a",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                        Create Report Builder
                    </h3>

                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#aaa",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        overflow: "hidden",
                    }}
                >
                    {/* LEFT PANEL */}
                    <div
                        style={{
                            flex: 2,
                            borderRight: "1px solid #2a2a2a",
                            padding: "16px",
                            overflowY: "auto",
                            background: "#171717",
                        }}
                    >
                        <CreateTableColumnsAndMapping />
                    </div>

                    {/* RIGHT PANEL */}
                    <div
                        style={{
                            flex: 1,
                            padding: "16px",
                            overflowY: "auto",
                            background: "#121212",
                        }}
                    >
                        <ApiResponseDataDisplay data={data} error={error} loading={loading} inputUrl={inputUrl} setInputUrl={setInputUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReportModal;