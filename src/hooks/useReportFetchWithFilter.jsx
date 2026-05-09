import { useEffect, useState } from "react";
import { getLeafColumns, getValue } from "../components/CustomTable";

const useReportFetchWithFilter = ({ baseUrl, columns }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0); // 👈 pagination
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    useEffect(() => {
        if (!baseUrl) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    limit,
                    skip,
                });

                // ✅ add search only if exists
                if (search.trim()) {
                    params.append("search", search);
                }

                // ✅ add sorting
                if (sortBy) {
                    params.append("sortBy", sortBy);
                    params.append("order", sortOrder);
                }

                const url = `${baseUrl}?${params.toString()}`;

                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result = await res.json();
                setData(result);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl, limit, skip, search, sortOrder, sortBy]);

    const exportToExcel = async () => {
        try {
            const params = new URLSearchParams();

            params.append("limit", 0);

            if (search.trim()) {
                params.append("search", search);
            }

            if (sortBy) {
                params.append("sortBy", sortBy);
                params.append("order", sortOrder);
            }

            const url = `${baseUrl}?${params.toString()}`;

            const res = await fetch(url);
            const result = await res.json();

            const rows = result.users || result.products || result;

            // 🔥 reuse table structure
            const leafColumns = getLeafColumns(columns);

            const headers = leafColumns.map((col) => col.header);

            const csvRows = [
                headers.join(","),
                ...rows.map((row) =>
                    leafColumns
                        .map((col) => {
                            const value = col.accessor
                                ? getValue(row, col.accessor)
                                : col.render
                                    ? col.render(row)
                                    : "";
                            return JSON.stringify(value ?? "");
                        })
                        .join(",")
                ),
            ];

            const csv = csvRows.join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const urlBlob = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = urlBlob;
            a.download = "report-export.csv";
            a.click();

            window.URL.revokeObjectURL(urlBlob);
        } catch (err) {
            console.error("Export failed", err);
        }
    };
    const handleSort = (column) => {
        if (!column.accessor) return;

        // same column clicked again
        if (sortBy === column.accessor) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(column.accessor);
            setSortOrder("asc");
        }

        // reset pagination
        setSkip(0);
    };
    // ✅ Renderable component inside hook
    const InpurLimitComponent = () => {
        return (
            <div>
                {/* LIMIT CONTROL */}
                <div >
                    <label>Limit: </label>
                    <input
                        type="number"
                        value={limit}
                        min={1}
                        max={100}
                        onChange={(e) => setLimit(Number(e.target.value))}
                    />
                </div>

            </div>
        );
    };
    // ✅ PAGINATION CONTROLS
    const PaginationComponent = () => (
        <div style={{ marginTop: "20px" }}>
            <button
                disabled={skip === 0}
                onClick={() => setSkip((prev) => Math.max(prev - limit, 0))}
            >
                Prev
            </button>

            <span style={{ margin: "0 10px" }}>
                Page: {Math.floor(skip / limit) + 1}
            </span>

            <button
                disabled={skip + limit >= (data?.total || 0)}
                onClick={() => setSkip((prev) => prev + limit)}
            >
                Next
            </button>
        </div>
    );
    // ✅ SEARCH UI FUNCTION (your request)
    const RenderSearchInputComponent = () => {
        return (
            <div>
                <label>Search: </label>
                <input
                    type="text"
                    value={search}
                    placeholder="search..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        );
    };
    return {
        data, loading, error, InpurLimitComponent, RenderSearchInputComponent, PaginationComponent,
        reportWrapperItems: {
            InpurLimitComponent, RenderSearchInputComponent, PaginationComponent, exportToExcel
        },
        exportToExcel,
        handleSort,
        sortBy,
        sortOrder,
    };
};

export default useReportFetchWithFilter;