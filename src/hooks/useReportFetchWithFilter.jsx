import { useEffect, useState } from "react";

const useReportFetchWithFilter = (baseUrl) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(2);
    const [skip, setSkip] = useState(0); // 👈 pagination
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!baseUrl) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = "";

                // ✅ SWITCH ENDPOINT BASED ON SEARCH
                if (search.trim()) {
                    url = `${baseUrl}/search?q=${search}&limit=${limit}&skip=${skip}`;
                } else {
                    url = `${baseUrl}?limit=${limit}&skip=${skip}`;
                }

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
    }, [baseUrl, limit, skip, search]);

    // ✅ Renderable component inside hook
    const InpurLimitComponent = () => {
        return (
            <div>
                {/* LIMIT CONTROL */}
                <div style={{ marginBottom: "20px" }}>
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
            <div style={{ marginTop: "10px", marginBottom: "20px" }}>
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
    };
};

export default useReportFetchWithFilter;