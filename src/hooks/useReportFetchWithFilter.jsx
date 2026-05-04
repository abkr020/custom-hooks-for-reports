import { useEffect, useState } from "react";

const useReportFetchWithFilter = (baseUrl) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(2);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!baseUrl) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = `${baseUrl}?_limit=${limit}`;

                if (search.trim()) {
                    url += `&q=${search}`;
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
    }, [baseUrl, limit, search]);

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
    return { data, loading, error, InpurLimitComponent, RenderSearchInputComponent };
};

export default useReportFetchWithFilter;