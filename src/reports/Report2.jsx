import React from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";
import CustomTable from "../components/CustomTable";
import ReportWrapper from "../components/ReportWrapper";

export const userTableColumns = [
    {
        header: "ID",
        accessor: "id",
    },
    {
        header: "Full Name",
        children: [
            {
                header: "First Name",
                accessor: "firstName",
            },
            {
                header: "Last Name",
                accessor: "lastName",
            },
        ],
    },
    {
        header: "Age",
        accessor: "age",
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "City",
        accessor: "address.city", // ✅ nested support
    },
    {
        header: "Company",
        accessor: "company.name",
    },
    {
        header: "Role",
        accessor: "role",
    },
];
export const usersUrl = "https://dummyjson.com/users";
const Report2 = () => {
    // const url = "https://dummy.restapiexample.com/api/v1/employees";

    const { data, loading, error, InpurLimitComponent, RenderSearchInputComponent, PaginationComponent, reportWrapperItems, handleSort, sortBy, sortOrder, } =
        useReportFetchWithFilter({
            baseUrl: usersUrl,
            columns: userTableColumns,
        });

    console.log("data", data);


    return (
        <div style={{ border: "2px solid tomato" }}>
            <ReportWrapper
                title="Report 2 (Users)"
                reportWrapperItems={reportWrapperItems}
                loading={loading}
                error={error}
            >
                <CustomTable
                    columns={userTableColumns}
                    data={data?.users}
                    handleSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </ReportWrapper>
        </div>
    );
};

export default Report2;