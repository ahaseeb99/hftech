import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table";
import _get from "lodash/get";
import { Col, Row } from "react-bootstrap";
import CustomDropdownValue from "../../../../../components/CustomDropDrownValue/CustomDropDrownValue";
import ExportWorkOrderExcelSheet from "../../ExportExcelSheet/ExportExcel";
import { useEffect } from "react";
import { currencyConverter } from "../../../../../utils/helpers";

const TableContainer = (props: any) => {
  const { 
    columns,
    data,
    handlePageLimit,
    handlePageNumber,
    handleNextPage,
    handlePreviousPage,
    metaData,
    handleFilterChange,
    setClientFilterBy,
    clientsData,
    clientFilterBy,
    handleClearFilterButton,
    loading,
    searchQuery,
    handleGetAllData
  } = props;

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
    pageNumber
  }: any = useTable(
    {
      columns,
      data,
      initialState: { pageSize: metaData?.length ? metaData?.length : 0},
      pages: metaData.totalPages
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
    );

  useEffect(() => {
    setPageSize(Number(metaData?.length || 50))
  },[metaData])
  
  const total : number =  data?.reduce((acc, cur) => {
    if (cur?.EstimateId?.total) {
      acc += cur?.EstimateId?.total
    }
    return acc
  }, 0)
  
  
  return (
    <>
      <Row className="mb-6 d-flex justify-content-between align-items-center">
        <Col className="d-flex justify-content-start align-items-center col-sm-12 col-lg-6">
          <ExportWorkOrderExcelSheet data={data} disabled={loading} />
        </Col>
        <Col className="col-sm-12 col-lg-6">
          <props.extraFilters />
        </Col>
      </Row>
      <Row>
        <div className="fv-row col-lg-4 col-md-12 col-sm-12">
          <CustomDropdownValue
            name="client"
            value={{
              value: clientFilterBy ? clientFilterBy : "Select a Client...",
              label: clientFilterBy ? clientFilterBy : "Select a Client...",
            }}
            className={"form-control form-control-solid"}
            options={_get(clientsData, "clients", []).map((item) => {
              return {
                label: item?.DisplayAs,
                value: item?._id,
              };
            })}
            onChange={(e) => setClientFilterBy(e)}
          />
        </div>
        <div className="fv-row mb-7 col-lg-4 col-md-12 col-sm-12">
          <input
            type="text"
            placeholder="Search"
            name="search"
            className={"form-control form-control-solid"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilterChange(e);
              }
            }}
          />
        </div>
        <div className="fv-row md-7 col-lg-2 col-md-6 col-sm-6">
          <button
            onClick={props.handleFilterButton}
            className="w-100 btn-primary form-control btn"
          >
            filter
          </button>
        </div>
        <div className="fv-row md-7 col-lg-2 col-md-6 col-sm-6">
          <button
            onClick={handleClearFilterButton}
            className="w-100 btn-secondary form-control btn"
          >
            Clear Filters
          </button>
        </div>
      </Row>
      <div className="table-responsive">
        <table
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr
                className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {loading && (
              <tr className="text-center">
                <td colSpan={12}>
                  <span className="spinner-border spinner-border align-middle ms-2"></span>
                </td>
              </tr>
            )}
            {page.length > 0 &&
              !loading &&
              page.map((row: any) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell: any) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            {page.length == 0 && !loading && (
              <tr className="text-center">
                <td colSpan={12}>Workorders not found </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-end pe-2"
        style={{ margin: "10px 0" }}
      >
        <div className="d-flex align-items-center"> 
          <label className="fs-1 me-4">Total:</label>
          <p className="m-0 fs-1">{currencyConverter(loading ? 0 : total)}</p>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-end"
      >
          <div className="pagination d-flex align-items-center">
            <button
              className={
                metaData.currentPage !== 1 &&
                metaData.currentPage <= metaData.totalPages
                  ? "btn btn-sm btn-primary me-5"
                  : "btn btn-sm btn-light btn-active-light-primary me-5"
              }
              data-kt-menu-dismiss="true"
              onClick={() => {
                previousPage();
                handlePreviousPage(metaData.currentPage - 1);
              }}
              disabled={metaData.currentPage === 1}
            >
              Previous
            </button>
            <div className="d-flex align-items-center me-5">
              <label className="d-flex align-items-center fs-5 fw-semibold me-3">
                <span>
                  Page {metaData.getAllWorkOrder ? "1" : metaData.currentPage} of {metaData.getAllWorkOrder ? "1" : metaData.totalPages}
                </span>
              </label>
              <select
                className="form-select form-select-solid me-5"
                value={metaData?.currentPage}
                onChange={(e) => {
                  handlePageNumber(parseInt(e.target.value));
                }}
                style={{ width: "150px" }}
              >
              {Array.from({ length: metaData.getAllWorkOrder ? 1 : metaData.totalPages || 1 }).map(
                  (_, index) => (
                    <option key={index} value={index + 1}>
                      Page {index + 1}
                    </option>
                  )
                )}
              </select>
            </div>
            <select
              className="form-select form-select-solid me-5"
              disabled={loading}
              defaultValue={50}
              onChange={(e) => {
                if(e.target.value === "All") {
                  handleGetAllData();
                  return
                }
                setPageSize(Number(e.target.value));
                handlePageLimit(e.target.value);
              }}
              style={{ width: "150px" }}
            >
              {[2, 10, 20, 30, 40, 50,"All"].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <button
              className={
                metaData.currentPage !== metaData.totalPages
                  ? "btn btn-sm btn-primary"
                  : "btn btn-sm btn-light btn-active-light-primary me-2"
              }
              data-kt-menu-dismiss="true"
              onClick={() => {
                nextPage();
                handleNextPage(metaData.currentPage + 1);
              }}
              disabled={metaData.currentPage === metaData.totalPages}
            >
              Next
            </button>
          </div>
      </div>
    </>
  );
};
// 	const navigate = useNavigate();
// 	const openViewPage = (row) => {
// 		// console.log("Hello", row, '/order/view/'+row?.original?.Data?.Id);
// 		navigate('/order/view/'+row?.original?.Data?.Id);
// 	}
// 	return (
// 		<>
// 			<Row>
// 				{/*<div className="fv-row mb-7 col-6">*/}
// 				{/*	<label className="fw-bold fs-6 mb-2">Client</label>*/}
// 				{/*	<CustomDropdown*/}
// 				{/*		name="client"*/}
// 				{/*		className=""*/}
// 				{/*		value={filterInput}*/}
// 				{/*		isClearable={filterInput !== null}*/}
// 				{/*		options={_get(clientsData, "clients", []).map((item) => {*/}
// 				{/*			return {*/}
// 				{/*				label: item?.fullName,*/}
// 				{/*				value: item?._id*/}
// 				{/*			};*/}
// 				{/*		})}*/}
// 				{/*		onChange={(e) => handleFilterChangeOnCustomer(e)}*/}
// 				{/*	/>*/}
// 				{/*</div>*/}
// 				<div className="fv-row mb-7 col-6">
// 					{/* <label className="fw-bold fs-6 mb-2  d-flex justify-content-start">
// 						Search
// 					</label> */}
// 					<input
// 						type="text"
// 						placeholder="Search"
// 						name="search"
// 						className={"form-control form-control-solid mb-3 mb-lg-0"}
// 						onChange={handleFilterChange}
// 					/>
// 				</div>
// 			</Row>
// 			<div className="table-responsive">
// 				<table
// 					className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
// 					{...getTableProps()}
// 				>
// 					<thead>
// 					{headerGroups.map((headerGroup: any) => (
// 						<tr
// 							className="pd-2 text-start text-muted fw-bolder fs-7 text-uppercase gs-0 bg-light"
// 							{...headerGroup.getHeaderGroupProps()}
// 						>
// 							{headerGroup.headers.map((column: any, index: any) => (
// 								<th {...column.getHeaderProps(column.getSortByToggleProps())}
// 								className={index == 0 ? "ps-4 rounded-start" : index == headerGroup.headers.length - 1 ? "min-w-200px rounded-end" : ""}
// 								>
// 									{column.render("Header")}
// 									{generateSortingIndicator(column)}
// 								</th>
// 							))}
// 						</tr>
// 					))}
// 					</thead>

// 					<tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
// 					{page.map((row: any) => {
// 						prepareRow(row);
// 						return (
// 							<tr {...row.getRowProps()} onClick={() => openViewPage(row)} style={{cursor: 'pointer'}}>
// 								{row.cells.map((cell: any, index: any) => {
// 									return <td
// 									className={index == 0 ? "p-4": "" + 'text-dark fw-semibold'}
// 									style={cell.column.id == 'PRIORITY' ? { maxWidth: '400px', verticalAlign: 'top',textAlign: 'center', lineHeight: '2.2rem'} : {maxWidth: '400px', verticalAlign: 'top', lineHeight: '2.2rem'}}
// 									{...cell.getCellProps()}>{cell.render("Cell")}</td>;
// 								})}
// 							</tr>
// 						);
// 					})}
// 					</tbody>
// 				</table>
// 			</div>
// 			<div
// 				className="d-flex align-items-center justify-content-center mt-5"
// 				style={{ marginTop: "35px" }}
// 			>
// 				<div className="pagination d-flex align-items-center">
// 					<button
// 						className={
// 							canPreviousPage
// 								? "btn btn-sm btn-primary me-5"
// 								: "btn btn-sm btn-light btn-active-light-primary me-5"
// 						}
// 						data-kt-menu-dismiss="true"
// 						onClick={() => previousPage()}
// 						disabled={!canPreviousPage}
// 					>
// 						Previous
// 					</button>
// 					<div className="d-flex align-items-center me-5">
// 						<label className="d-flex align-items-center fs-5 fw-semibold me-3">
// 							<span>
// 								Page {pageIndex + 1} of {pageOptions.length}
// 							</span>
// 						</label>
// 						<input
// 							className="form-control form-control-lg form-control-solid"
// 							type="number"
// 							defaultValue={pageIndex + 1}
// 							onChange={(e) => {
// 								const page = e.target.value ? Number(e.target.value) - 1 : 0
// 								gotoPage(page)
// 							}}
// 							style={{ width: "100px" }}
// 						/>
// 					</div>
// 					<select
// 						className="form-select form-select-solid me-5"
// 						value={pageSize}
// 						onChange={(e) => {
// 							setPageSize(Number(e.target.value))
// 						}}
// 						style={{ width: "150px" }}
// 					>
// 						{[2, 10, 20, 30, 40, 50].map((pageSize) => (
// 							<option key={pageSize} value={pageSize}>
// 								Show {pageSize}
// 							</option>
// 						))}
// 					</select>
// 					<button
// 						className={
// 							canNextPage
// 								? "btn btn-sm btn-primary"
// 								: "btn btn-sm btn-light btn-active-light-primary me-2"
// 						}
// 						data-kt-menu-dismiss="true"
// 						onClick={() => nextPage()}
// 						disabled={!canNextPage}
// 					>
// 						Next
// 					</button>
// 				</div>
// 			</div>
// 		</>
// 	)
// }

const generateSortingIndicator = (column: any) => {
  return column.isSorted ? (
    column.isSortedDesc ? (
      <i
        className="bi bi-chevron-down fw-bold gy-5"
        style={{ marginLeft: "5px" }}
      ></i>
    ) : (
      <i
        className="bi bi-chevron-up fw-bold gy-5"
        style={{ marginLeft: "5px" }}
      ></i>
    )
  ) : (
    ""
  );
};

export default TableContainer;
