import { useEffect, useState } from "react";
import { getLeafColumns, getValue } from "../components/CustomTable";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import DynamicFilter from "../components/DynamicFilter";

const useReportFetchWithFilter = ({ baseUrl, columns, filters = [],
}) => {
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

    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedSections, setSelectedSections] = useState([]);

    const [downloadMode, setDownloadMode] = useState("filtered");

    // ==============================
    // filter states
    // ==============================
    const [filtersState, setFiltersState] = useState({});
    const [filterOptions, setFilterOptions] = useState({});

    useEffect(() => {

        const fetchFilterOptions = async () => {

            try {

                const optionsData = {};

                for (const filter of filters) {

                    // static options
                    if (filter.options) {

                        optionsData[filter.key] =
                            filter.options;

                        continue;
                    }

                    // dynamic options
                    if (filter.endpoint) {

                        const res = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}${filter.endpoint}`
                        );

                        const result =
                            await res.json();

                        optionsData[filter.key] =
                            result[filter.key] ||
                            result.options ||
                            [];
                    }
                }

                setFilterOptions(optionsData);

            } catch (err) {

                console.error(
                    "Failed to fetch filter options",
                    err
                );
            }
        };

        fetchFilterOptions();

    }, []);

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

        if (!selectedClasses.length) {

            setSections([]);
            setSelectedSections([]);

            return;
        }

        const fetchSections = async () => {

            try {

                const params =
                    new URLSearchParams({ classes: selectedClasses.join(","), });

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/reports/students/sections?${params}`
                );

                const result =
                    await res.json();

                setSections(
                    result.sections || []
                );

            } catch (err) {

                console.error(
                    "Failed to fetch sections",
                    err
                );
            }
        };

        fetchSections();

    }, [selectedClasses]);

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
                if (selectedClasses.length) {
                    params.append("classes", selectedClasses.join(","));
                }

                if (selectedSections.length) {
                    params.append("sections", selectedSections.join(","));
                }

                Object.entries(filtersState).forEach(([key, value]) => {

                    // array values
                    if (Array.isArray(value) && value.length) {
                        params.append(key, value.join(","));
                    }

                    // single values
                    else if (value) {
                        params.append(key, value);
                    }
                });

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
    }, [baseUrl, limit, skip, search, sortOrder, sortBy, selectedClass, selectedSection, selectedClasses, selectedSections, filtersState,]);

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

            const rows = result.data || result.users || result.products || result;

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
    const handleDownload = async (mode = "filtered") => {

        try {

            const params = new URLSearchParams();

            // always fetch everything if "all"
            if (mode === "all") {
                // params.append("limit", 0);
            } else {
                params.append("limit", limit);
                params.append("skip", skip);
            }

            // apply filters only for filtered mode
            if (mode === "filtered") {

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

                if (selectedClasses.length) {
                    params.append("classes", selectedClasses.join(","));
                }

                if (selectedSections.length) {
                    params.append("sections", selectedSections.join(","));
                }
            }

            const url = `${baseUrl}?${params.toString()}`;

            const res = await fetch(url);
            const result = await res.json();

            const rows =
                result.data ||
                result.users ||
                result.products ||
                result.marks ||
                result;

            const leafColumns = getLeafColumns(columns);

            const headers = leafColumns?.map(
                (col) => col.header
            );

            const csvRows = [
                headers.join(","),
                ...rows?.map((row) =>
                    leafColumns
                        .map((col) => {
                            const value =
                                col.accessor
                                    ? getValue(row, col.accessor)
                                    : col.render
                                        ? col.render(row)
                                        : "";

                            return JSON.stringify(
                                value ?? ""
                            );
                        })
                        .join(",")
                ),
            ];

            const csv =
                csvRows.join("\n");

            const blob =
                new Blob([csv], {
                    type: "text/csv",
                });

            const urlBlob =
                window.URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = urlBlob;
            a.download =
                mode === "all"
                    ? "report-all.csv"
                    : "report-filtered.csv";

            a.click();

            window.URL.revokeObjectURL(urlBlob);

        } catch (err) {
            console.error("Download failed", err);
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
            <MultiSelectDropdown
                label="Classes"
                options={classes}
                selected={selectedClasses}
                setSelected={setSelectedClasses}
            />
        )
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
    const SectionFilterComponent = () => {
        return (
            <MultiSelectDropdown
                label="Sections"
                options={sections}
                selected={selectedSections}
                setSelected={setSelectedSections}
            />
        )
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
    const DownloadModeSelectComponent = () => {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    margin: "10px 0",
                    border: "1px solid #444",
                    borderRadius: "6px",
                    // overflow: "hidden",
                    // width: "fit-content",
                }}
            >

                {/* Dropdown */}
                <select
                    value={downloadMode}
                    onChange={(e) =>
                        setDownloadMode(e.target.value)
                    }
                    style={{
                        background: "#1e1e1e",
                        color: "#fff",
                        border: "none",
                        padding: "8px 10px",
                        outline: "none",
                    }}
                >
                    <option value="filtered">
                        With Filters
                    </option>

                    <option value="all">
                        All Data
                    </option>
                </select>

                {/* Divider */}
                <div
                    style={{
                        width: "1px",
                        background: "#444",
                    }}
                />

                {/* Button */}
                <button
                    onClick={() =>
                        handleDownload(downloadMode)
                    }
                    style={{
                        background: "#2b2b2b",
                        color: "#fff",
                        border: "none",
                        // padding: "8px 12px",
                        cursor: "pointer",
                    }}
                >
                    Download
                </button>

            </div>
        );
    };
    const DynamicFiltersComponent = () => {

        return (
            <>
                {filters.map((filter) => (

                    <DynamicFilter
                        key={filter.key}
                        filter={filter}
                        value={
                            filtersState[filter.key] ||
                            (
                                filter.type === "multi-select"
                                    ? []
                                    : ""
                            )
                        }
                        options={
                            filterOptions[filter.key] || []
                        }
                        // onChange={(value) => {

                        //     setFiltersState((prev) => ({
                        //         ...prev,
                        //         [filter.key]: value,
                        //     }));

                        //     setSkip(0);
                        // }}
                        onChange={(value) => {
                            setFiltersState((prev) => {
                                const resolvedValue =
                                    typeof value === "function"
                                        ? value(prev[filter.key] || [])
                                        : value;

                                return {
                                    ...prev,
                                    [filter.key]: resolvedValue,
                                };
                            });

                            setSkip(0);
                        }}
                    // onChange={(value) => {
                    //     const safeValue = typeof value === "function"
                    //         ? value([])
                    //         : value;

                    //     setFiltersState((prev) => ({
                    //         ...prev,
                    //         [filter.key]: Array.isArray(safeValue)
                    //             ? safeValue
                    //             : safeValue
                    //                 ? [safeValue]
                    //                 : [],
                    //     }));

                    //     setSkip(0);
                    // }}
                    />

                ))}
            </>
        );
    };
    return {
        data, loading, error, InpurLimitComponent, RenderSearchInputComponent, PaginationComponent,
        reportWrapperItems: {

            filters: [DynamicFiltersComponent, ClassFilterComponent, SectionFilterComponent, InpurLimitComponent, RenderSearchInputComponent, DownloadModeSelectComponent,],

            PaginationComponent,

            exportToExcel,
        },
        exportToExcel,
        handleSort,
        sortBy,
        sortOrder,
    };
};

export default useReportFetchWithFilter;