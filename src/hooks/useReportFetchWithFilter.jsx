import { useEffect, useState } from "react";

const useReportFetchWithFilter = (baseUrl) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if (!baseUrl) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = `${baseUrl}?_limit=${limit}`;

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
    }, [baseUrl, limit]);

    return { data, loading, error };
};

export default useReportFetchWithFilter;