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
    // ==============================
    // CLASS + SECTION FILTERS
    // ==============================

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [selectedClass, setSelectedClass] = useState("");

    const [selectedSection, setSelectedSection] = useState("");


    // ==============================
    // FETCH UNIQUE CLASSES
    // ==============================
    useEffect(() => {

        const fetchClasses = async () => {

            try {

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/reports/students/classes`
                );

                const result = await res.json();

                setClasses(result.classes || []);

            } catch (err) {

                console.error(
                    "Failed to fetch classes",
                    err
                );
            }
        };

        fetchClasses();

    }, []);


    // ==============================
    // FETCH SECTIONS BY CLASS
    // ==============================
    useEffect(() => {

        if (!selectedClass) {

            setSections([]);
            setSelectedSection("");

            return;
        }

        const fetchSections = async () => {

            try {

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/reports/students/classes/${selectedClass}/sections`
                );

                const result = await res.json();

                setSections(result.sections || []);

            } catch (err) {

                console.error(
                    "Failed to fetch sections",
                    err
                );
            }
        };

        fetchSections();

    }, [selectedClass]);



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
                // ✅ class filter
                if (selectedClass) {
                    params.append("class", selectedClass);
                }

                // ✅ section filter
                if (selectedSection) {
                    params.append("section", selectedSection);
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
    }, [baseUrl, limit, skip, search, sortOrder, sortBy, selectedClass, selectedSection,]);

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
            if (selectedClass) {
                params.append("class", selectedClass);
            }

            if (selectedSection) {
                params.append("section", selectedSection);
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
    // ==============================
    // CLASS FILTER COMPONENT
    // ==============================
    const ClassFilterComponent = () => {

        return (
            <div>

                <label>
                    Class:
                </label>

                <select
                    value={selectedClass}
                    onChange={(e) => {

                        setSelectedClass(
                            e.target.value
                        );

                        // reset section
                        setSelectedSection("");

                        // reset pagination
                        setSkip(0);
                    }}
                >

                    <option value="">
                        All Classes
                    </option>

                    {classes.map((cls) => (
                        <option
                            key={cls}
                            value={cls}
                        >
                            {cls}
                        </option>
                    ))}

                </select>
            </div>
        );
    };
    // ==============================
    // SECTION FILTER COMPONENT
    // ==============================
    const SectionFilterComponent =
        () => {

            return (
                <div>

                    <label>
                        Section:
                    </label>

                    <select
                        value={selectedSection}
                        disabled={!selectedClass}
                        onChange={(e) => {

                            setSelectedSection(
                                e.target.value
                            );

                            setSkip(0);
                        }}
                    >

                        <option value="">
                            All Sections
                        </option>

                        {sections.map((section) => (
                            <option
                                key={section}
                                value={section}
                            >
                                {section}
                            </option>
                        ))}

                    </select>
                </div>
            );
        };
    return {
        data, loading, error, InpurLimitComponent, RenderSearchInputComponent, PaginationComponent,
        reportWrapperItems: {
            ClassFilterComponent, SectionFilterComponent, InpurLimitComponent, RenderSearchInputComponent, PaginationComponent, exportToExcel
        },
        exportToExcel,
        handleSort,
        sortBy,
        sortOrder,
    };
};

export default useReportFetchWithFilter;