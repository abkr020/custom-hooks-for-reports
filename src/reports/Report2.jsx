import React from "react";
import useReportFetchWithFilter from "../hooks/useReportFetchWithFilter";
import CustomTable from "../components/CustomTable";

const Report2 = () => {
    const userTableColumns = [
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
    const url = "https://dummyjson.com/users";
    // const url = "https://dummy.restapiexample.com/api/v1/employees";

    const { data, loading, error, InpurLimitComponent, RenderSearchInputComponent, PaginationComponent } =
        useReportFetchWithFilter(url);

    console.log("data", data);


    return (
        <div style={{ border: "2px solid tomato" }}>
            <h2>Report 2 (Users)</h2>

            {InpurLimitComponent()}
            {RenderSearchInputComponent()}
            {PaginationComponent()}
            {/* loading indicator (non-blocking) */}
            {loading && <p style={{ color: "blue" }}>Loading...</p>}

            {/* error */}
            {error && <p style={{ color: "red" }}>{error}</p>}


            <CustomTable columns={userTableColumns} data={data?.users} />
        </div>
    );
};

export default Report2;