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
    "http://localhost:8080/api/reports/marks";

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
                loading={loading}
                error={error}
            >
                <CustomTable
                    columns={marksTableColumns}
                    data={data?.marks}
                    handleSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </ReportWrapper>
        </div>
    );
};

export default MarksReport;