import React, { useState } from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";

import Report1, { productsUrl, productTableolumns } from "../reports/Report1";
import Report2, { usersUrl, userTableColumns } from "../reports/Report2";


const Dashboard = () => {
    const [search, setSearch] = useState("");
    const { exportToExcel: productExportToExcel } = useReportFetchWithFilter({
        baseUrl: productsUrl,
        columns: productTableolumns,
    });
    const { exportToExcel: userExportToExcel } = useReportFetchWithFilter({
        baseUrl: usersUrl,
        columns: userTableColumns,
    });
    const downloadAllReports = async () => {
        await userExportToExcel()
        await productExportToExcel()
    }
    return (
        <div style={{ padding: "20px" }}>
            <h2>Dashboard</h2>

            {/* GLOBAL FILTER */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    value={search}
                    placeholder="Global search..."
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={downloadAllReports} style={{ marginLeft: "10px" }}>
                    Download All Reports
                </button>
            </div>

        </div>
    );
};

export default Dashboard;