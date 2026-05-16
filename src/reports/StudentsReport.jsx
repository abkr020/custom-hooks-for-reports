import React from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";
import CustomTable from "../components/CustomTable";
import ReportWrapper from "../components/ReportWrapper";

export const studentTableColumns = [
    {
        header: "ID",
        accessor: "id",
    },

    {
        header: "Student Name",
        children: [
            {
                header: "First Name",
                accessor: "name.first_name",
            },
            {
                header: "Last Name",
                accessor: "name.last_name",
            },
        ],
    },

    {
        header: "Gender",
        accessor: "gender",
    },

    {
        header: "Age",
        accessor: "age",
    },

    {
        header: "Class Info",
        children: [
            {
                header: "Class",
                accessor: "classInfo.class",
            },
            {
                header: "Section",
                accessor: "classInfo.section",
            },
        ],
    },

    {
        header: "Address",
        children: [
            {
                header: "City",
                accessor: "address.city",
            },
            {
                header: "Country",
                accessor: "address.country",
            },
        ],
    },
];

export const studentsUrl = `${import.meta.env.VITE_BACKEND_URL}/reports/students`;

const StudentsReport = () => {

    const {
        data,
        loading,
        error,
        reportWrapperItems,
        handleSort,
        sortBy,
        sortOrder,
    } = useReportFetchWithFilter({
        baseUrl: studentsUrl,
        columns: studentTableColumns,
        filters: [
            {
                key: "country",
                label: "Country",
                type: "multi-select",
                endpoint: "/reports/students/countries"
            },
            // {
            //     key: "city",
            //     label: "City",
            //     type: "multi-select",
            //     endpoint: "/reports/students/cities",
            //     dependsOn: "country"
            // },
            {
                key: "gender",
                label: "Gender",
                type: "select",
                options: ["Male", "Female"]
            }
        ]
    });

    console.log("students data", data);

    return (
        <div style={{ border: "2px solid teal" }}>
            <ReportWrapper
                title="Students Report"
                reportWrapperItems={reportWrapperItems}
                // loading={loading}
                error={error}
            >
                <CustomTable
                    columns={studentTableColumns}
                    data={data?.data}
                    loading={loading}
                    handleSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </ReportWrapper>
        </div>
    );
};

export default StudentsReport;