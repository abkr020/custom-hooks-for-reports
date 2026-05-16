import React, { useState } from "react";
import useReportFetchWithFilter from "../../hooks/useReportFetchWithFilter";

const ApiResponseDataDisplay = ({ data, loading, error ,inputUrl, setInputUrl} ) => {
   
    // 👇 INLINE JSON NODE (DevTools style)
    const JsonNode = ({ data, name, path = "" }) => {
        const [open, setOpen] = useState(true);

        const isObject =
            data && typeof data === "object" && !Array.isArray(data);
        const isArray = Array.isArray(data);

        const isPrimitive = !isObject && !isArray;
        // 👇 key filter (important)
        const isArrayIndex = typeof name === "number" || /^\d+$/.test(name);

        // 🚀 ignore root key ("data") + ignore array indexes
        const isRoot = path === "" && name === "data";

        // final path
        const currentPath =
            isRoot
                ? "" // ❌ remove "data"
                : name !== undefined
                    ? path
                        ? isArrayIndex
                            ? path // ❌ skip array index
                            : `${path}.${name}`
                        : isArrayIndex
                            ? ""
                            : `${name}`
                    : path;
        const handleDrag = (key) => (e) => {
            console.log("Dragging key:", key);
            e.dataTransfer.setData("key", key);
        };
        if (isPrimitive) {
            return (
                <div draggable onDrag={handleDrag(currentPath)} title={`key: ${currentPath}`} style={{ paddingLeft: "14px", color: "#feb89c", display: "flex", justifyContent: "left", border: "0.09rem solid #2a2a2a", borderRadius: "0.4rem" }}>
                    {name !== undefined && (
                        <span style={{ color: "#9cdcfe" }}>{name}: </span>
                    )}
                    <span style={{ color: "#ce9178" }}>{String(data)}</span>
                </div>
            );
        }

        return (
            <div style={{ paddingLeft: "14px" }}>
                {/* HEADER */}
                <div
                    onClick={() => setOpen(!open)}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        // alignItems: "center",
                        gap: "6px",
                        color: "#d4d4d4",
                        userSelect: "none",
                    }}
                >
                    <span style={{ color: "#858585" }}>
                        {open ? "▼" : "▶"}
                    </span>

                    {name !== undefined && (
                        <span style={{ color: "#9cdcfe" }}>{name}:</span>
                    )}

                    <span style={{ color: "#4ec9b0" }}>
                        {isArray ? "Array" : "Object"}
                    </span>

                    <span style={{ color: "#858585" }}>
                        ({Object.keys(data).length})
                    </span>
                </div>

                {/* CHILDREN */}
                {open && (
                    <div
                        style={{
                            marginLeft: "10px",
                            borderLeft: "1px solid #2a2a2a",
                            paddingLeft: "8px",
                        }}
                    >
                        {isArray
                            ? data.map((item, idx) => (
                                <JsonNode key={idx} name={idx} data={item} path={currentPath} />
                            ))
                            : Object.entries(data).map(([key, value]) => (
                                <JsonNode key={key} name={key} data={value} path={currentPath} />
                            ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                height: "100%",
            }}
        >
            <div style={{ fontSize: "14px", color: "#bdbdbd" }}>
                API Response Preview
            </div>

            {/* INPUT */}
            <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter API URL..."
                style={{
                    padding: "10px",
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "#e6e6e6",
                    outline: "none",
                }}
            />

            {/* LOADING */}
            {loading && (
                <div
                    style={{
                        padding: "10px",
                        background: "#1f1f1f",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        color: "#9e9e9e",
                        fontSize: "13px",
                    }}
                >
                    Loading...
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div
                    style={{
                        padding: "10px",
                        background: "#1f1a1a",
                        border: "1px solid #3a2a2a",
                        borderRadius: "8px",
                        color: "#c77",
                        fontSize: "13px",
                    }}
                >
                    {error}
                </div>
            )}

            {/* DATA (DEVTOOLS STYLE VIEWER) */}
            {data && (
                <div
                    style={{
                        flex: 1,
                        overflow: "auto",
                        background: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        padding: "10px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                    }}
                >
                    <JsonNode data={data} />
                </div>
            )}
        </div>
    );
};

export default ApiResponseDataDisplay;