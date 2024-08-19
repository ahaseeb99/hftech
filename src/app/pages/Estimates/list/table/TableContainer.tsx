import React, { useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useFilters,
} from "react-table";
import clsx from "clsx";
import CustomDropdown from "../../../../../components/CustomDropdown/CustomDropdown";
import _get from "lodash/get";
import { useSelector } from "react-redux";
import { Row } from "react-bootstrap";
import ExportEstimateExcelSheet from "../../ExportExcelSheet/ExportExcel";
import { currencyConverter } from "../../../../../utils/helpers";

const TableContainer = (props: any) => {
  const { columns, data } = props;
  const { clientsData } = useSelector((state: any) => state.client);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
    setFilter,
  }: any = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 50 }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const onChangeInSelect = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event: any) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const handleFilterChange = (e) => {
    const { value } = e.currentTarget;
    setGlobalFilter(value);
  };

  // Create a state
  const [filterInput, setFilterInput] = useState("");

  // Update the state when input changes
  const handleFilterChangeOnCustomer = (e) => {
    if (e === null) {
      setFilter("client.DisplayAs", "");
    } else {
      setFilter("client.DisplayAs", e?.label);
      setFilterInput(e?.label);
    }
  };

  const total : number = page.length > 0 ? page?.reduce((acc,cur) => {
   if(cur?.original?.total){
    acc += cur?.original?.total
   }
   return acc
  },0) : 0

  return (
    <>
      <div className="d-flex justify-content-end">
        <ExportEstimateExcelSheet data={data} disabled={props?.isLoading} />
      </div>
      <Row className="mb-6">
          <div  className="fv-row mb-7 col-6">
          </div>
          <props.extraFilters /> 
      </Row>
      <Row>
        <div className="fv-row mb-7 col-4">
          <CustomDropdown
            name="client"
            className=""
            value={filterInput}
            isClearable={filterInput !== null}
            placeholder="Select a Client..."
            options={_get(clientsData, "clients", []).map((item) => {
              return {
                label: item?.DisplayAs,
                value: item?._id,
              };
            })}
            onChange={(e) => handleFilterChangeOnCustomer(e)}
          />
        </div>
        <div className="fv-row mb-7 col-8">
          <input
            type="text"
            placeholder="Search"
            name="search"
            className={"form-control form-control-solid mb-3 mb-lg-0"}
            onChange={handleFilterChange}
          />
        </div>
      </Row>
      <div className="table-responsive">
        <table
          // className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          // className="table align-middle gs-0 gy-4"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr
                className="pd-2 text-start text-muted fw-bolder fs-7 text-uppercase gs-0 bg-light"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column: any, index: any) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={index == 0 ? "ps-4 min-w-300px rounded-start" : index == headerGroup.headers.length - 1 ? "min-w-200px rounded-end" : "" + column.id == 'Amount' ? 'text-end' : ''}
                  >
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
           {props.isLoading && (
                <tr className="text-center">
                  <td colSpan={12}><span className='spinner-border spinner-border align-middle ms-2'></span></td>
                </tr> 
              )}
            {(page.length > 0 && !props.isLoading) && page.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return (
                      <td className={cell.column.id == 'Amount' ? 'text-end' : '' + ' text-dark fw-semibold'} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
            {(page.length <= 0 && !props.isLoading) && (
                <tr className="text-center">
                  <td colSpan={12}>Estimates not found </td>
                </tr> 
              )}
          </tbody>
        </table>
        <div className="d-flex justify-content-end pe-2"
          style={{ margin: "10px 0" }}
        >
          <div className="d-flex align-items-center">
            <label className="fs-1 me-4">Total:</label>
            <p className="m-0 fs-1">{currencyConverter(total)}</p>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-center mt-10"
          style={{}}
        >
          <div className="pagination d-flex align-items-center">
            <button
              className={
                canPreviousPage
                  ? "btn btn-sm btn-primary me-5"
                  : "btn btn-sm btn-light btn-active-light-primary me-5"
              }
              data-kt-menu-dismiss="true"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </button>
            <div className="d-flex align-items-center me-5">
              <label className="d-flex align-items-center fs-5 fw-semibold me-3">
                <span>
                  Page {pageIndex + 1} of {pageOptions.length}
                </span>
              </label>
              <input
                className="form-control form-control-lg form-control-solid"
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: "100px" }}
              />
            </div>
            <select
              className="form-select form-select-solid me-5"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              style={{ width: "150px" }}
            >
              {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <button
              className={
                canNextPage
                  ? "btn btn-sm btn-primary"
                  : "btn btn-sm btn-light btn-active-light-primary me-2"
              }
              data-kt-menu-dismiss="true"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const generateSortingIndicator = (column: any) => {
  return column.isSorted ? (
    column.isSortedDesc ? (
      <i
        className="bi bi-chevron-down fw-bold gy-5"
        style={{ marginLeft: "5px" }}
      />
    ) : (
      <i
        className="bi bi-chevron-up fw-bold gy-5"
        style={{ marginLeft: "5px" }}
      />
    )
  ) : (
    ""
  );
};

export default TableContainer;
