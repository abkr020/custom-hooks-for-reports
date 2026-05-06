import React from 'react'
import useReportFetchWithFilter from '../hooks/useReportFetchWithFilter';
import CustomTable from '../components/CustomTable';
import ReportWrapper from '../components/ReportWrapper';

const Report1 = () => {
  const productTableolumns = [
    {
      header: "ID",
      accessor: "id",
    },
    {
      header: "Product Info",
      children: [
        {
          header: "Title",
          accessor: "title",
        },
        {
          header: "Category",
          accessor: "category",
        },
        {
          header: "Brand",
          accessor: "brand",
        },
      ],
    },
    {
      header: "Pricing",
      children: [
        {
          header: "Price",
          accessor: "price",
          render: (row) => `$${row.price}`,
        },
        {
          header: "Discount %",
          accessor: "discountPercentage",
          render: (row) => `${row.discountPercentage}%`,
        },
      ],
    },
    {
      header: "Stats",
      children: [
        {
          header: "Rating",
          accessor: "rating",
        },
        {
          header: "Stock",
          accessor: "stock",
          render: (row) => (
            <span style={{ color: row.stock < 10 ? "red" : "green" }}>
              {row.stock}
            </span>
          ),
        },
      ],
    },
    {
      header: "Status",
      accessor: "availabilityStatus",
    },
  ];
  const url = "https://dummyjson.com/products";
  const { data, loading, error, InpurLimitComponent, RenderSearchInputComponent, reportWrapperItems } = useReportFetchWithFilter({
    baseUrl: url,
    columns: productTableolumns,
  });
  console.log("data--", data);

  return (
    <div style={{ border: "2px solid tomato" }}>

      <ReportWrapper
        title="Report 2 (Products)"
        reportWrapperItems={reportWrapperItems}
        loading={loading}
        error={error}
      >

        <CustomTable
          columns={productTableolumns}
          data={data?.products}
        />
      </ReportWrapper>
    </div>
  )
}

export default Report1
