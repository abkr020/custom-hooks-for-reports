import React from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";
import CustomTable from "../components/CustomTable";
import ReportWrapper from "../components/ReportWrapper";

export const marksTableColumns = [
    {
        header: "ID",
        accessor: "id",
    },

    {
        header: "Student ID",
        accessor: "student_id",
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
        header: "Marks",
        children: [
            {
                header: "Physics",
                accessor: "marks.physics",
            },
            {
                header: "Chemistry",
                accessor: "marks.chemistry",
            },
            {
                header: "Maths",
                accessor: "marks.maths",
            },
        ],
    },

    {
        header: "Exam Type",
        accessor: "exam_type",
    },
];

export const marksUrl =
    `${import.meta.env.VITE_BACKEND_URL}/reports/marks`;

const MarksReport = () => {

    const {
        data,
        loading,
        error,
        reportWrapperItems,
        handleSort,
        sortBy,
        sortOrder,
    } = useReportFetchWithFilter({
        baseUrl: marksUrl,
        columns: marksTableColumns,
    });

    console.log("marks data", data);

    return (
        <div style={{ border: "2px solid purple" }}>
            <ReportWrapper
                title="Marks Report"
                reportWrapperItems={reportWrapperItems}
                // loading={loading}
                error={error}
                >
                <CustomTable
                    columns={marksTableColumns}
                    data={data?.marks}
                    loading={loading}
                    handleSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </ReportWrapper>
        </div>
    );
};

export default MarksReport;