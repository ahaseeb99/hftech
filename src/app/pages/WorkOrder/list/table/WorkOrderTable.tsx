import moment from "moment";
// import moment from "moment";
// import moment from 'moment-timezone';
// import moment from "moment";
// import moment from 'moment-timezone';
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { taskRefinementHTML } from "../../../../../utils/helpers";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import ContactModal from "../../showWorkorderContact/ContactModal";
import FlagModal from "../../showWorkorderContact/FlagModal";
import TableContainer from "./TableContainer";

enum PriorityList {
  Emergency,
  Regular,
  Low,
}

const ActionsButtons = (props: any) => {
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  // console.info("----------------------------")
  // console.info("props =>", props)
  // console.info("----------------------------")

  return (
    <>
      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Actions
        <KTSVG
          path="/media/icons/duotune/arrows/arr072.svg"
          className="svg-icon-5 m-0"
        />
      </a>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        <div className="menu-item px-3">
          <Link
            className="menu-link px-3"
            to={`/order/update/${props?.WorkOrderId?.Id}`}
          >
            Edit
          </Link>
        </div>
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            onClick={() => props.showDeleteModalHandler(props.data.id)}
          >
            Delete
          </a>
        </div>
      </div>
    </>
  );
};

const WorkOrderTable = ({
  WorkOrderData = [],
  showDeleteModalHandler,
}: any) => {
  const [contactModalData, setContactModalData] = useState<{}>();
  const WorkOrderColumns: any = [
    {
      Header: "STATUS",
      accessor: (values) => {
        console.log({ values });
        let status = values?.StatusId;
        let html = "";
        switch (status) {
          case "New":
            html += '<i class="bi bi-file-plus-fill fs-0" title="New"></i>';
            break;
          case "Completed":
            html +=
              '<i class="bi bi-file-check-fill fs-0" title="Completed"></i>';
            break;
        }
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/order/view/" + values?.Id)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      },
    },
    {
      Header: "WO#",
      accessor: "Number",
      Cell: ({ value, row }) => {
        return (
          <a
            target={"_blank"}
            className="menu-link"
            href={`https://am-ce99a.corrigo.com/corpnet/workorder/workorderdetails.aspx/${row.original?.Id}`}
            rel="noreferrer"
          >
            {" "}
            {value}{" "}
          </a>
        );
      },
    },
    {
      Header: "PO#",
      accessor: "PoNumber",
    },
    {
      Header: "SPACE",
      accessor: (values: any) => {
        // let space = values.Data.ShortLocation.replace('\\', '<br \>');
        let spaces = values?.ShortLocation?.split("\\");
        return (
          <>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
              {spaces.length > 0 ? spaces[0] : ""}
            </span>
            <span className="">{spaces[1]}</span>
          </>
        );
      },
    },
    {
      Header: "PRIORITY",
      accessor: (values: any) => {
        let priority =
          values?.Priority.Id === PriorityList.Emergency
            ? "EMR"
            : values?.Priority.Id === PriorityList.Regular
            ? "REG"
            : "LOW";
        return (
          <span
            className={`badge badge-lg badge-${
              priority === "EMR"
                ? "danger"
                : priority === "REG"
                ? "success"
                : "secondary"
            }`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      Header: "DESCRIPTION",
      accessor: (values: any) => {
        let html = taskRefinementHTML(values?.TaskRefinement);
        return <span dangerouslySetInnerHTML={{ __html: html }} />;
      },
    },
    {
      Header: "ASSIGNED TO",
      //   accessor: "Data.Employee",
      accessor: (values: any) => {
        return <p>{values?.Employee?.FirstName}</p>;
      },
    },
    {
      Header: "SCHEDULED TO",
      accessor: (values: any) => {
        // console.log(values.Data.ScheduledStartUtc, moment(values.Data.ScheduledStartUtc).tz('MST'));
        const start = moment.tz(values?.ScheduledStartUtc, "UTC");

        return (
          <span>
            {values?.ScheduledStartUtc
              ? start.tz("MST").format("MM/DD/YYYY")
              : ""}{" "}
            <br />
            {values?.ScheduledStartUtc
              ? start.tz("MST").format("hh:mm A")
              : "-"}
          </span>
        );
      },
    },
    {
      Header: "FLAG",
      accessor: (values: any) => {
        return values?.FlagId > 0 ? (
          <i
            onClick={() => setShowFlagModal(true)}
            style={{
              color: "red",
              cursor: "pointer",
            }}
            className="bi bi-flag-fill"
            title="Ready to Invoice"
          ></i>
        ) : (
          ""
        );
      },
    },
    // {
    //   Header: "CREATED BY",
    //   accessor: "Data.Owner.Id",
    // },
    {
      Header: "CONTACT",
      //   accessor: "Data.ContactName",
      accessor: (values: any) => {
        return (
          <Link
            to={""}
            onClick={() => {
              setContactModalData({
                contactName: values?.ContactName,
                contactId: values?.Id.toString(),
              });
              setShowContactModal(true);
            }}
            style={{ cursor: "pointer" }}
          >
            {values?.ContactName}
          </Link>
        );
      },
    },
    // {
    //   id: "actions",
    //   Header: "Action",
    //   accessor: (values: any) => {
    //     return values;
    //   },
    //   Cell: (values: any) => (
    //     <ActionsButtons
    //       WorkOrderId={values.value.Data}
    //       showDeleteModalHandler={() => showDeleteModalHandler(values.value)}
    //     />
    //   ),
    // },
  ];

  const [showContactModal, setShowContactModal] = useState<any>(false);
  const [showFlagModal, setShowFlagModal] = useState<any>(false);
  const navigate = useNavigate();

  const closeContactModalHandler = () => {
    setContactModalData({
      contactName: "",
      contactId: "",
    });
    setShowContactModal(false);
  };

  const data: any = useMemo(() => WorkOrderData, [WorkOrderData]);

  const columns: any = useMemo(() => WorkOrderColumns, []);

  return (
    <div>
      {showContactModal && (
        <ContactModal
          closeContactModalHandler={closeContactModalHandler}
          contactData={contactModalData}
          //   workOrderData={}
        />
      )}
      {showFlagModal && (
        <FlagModal
          closeFlagModalHandler={() => setShowFlagModal(false)}
          contactData={contactModalData}
          //   workOrderData={}
        />
      )}
      <KTCard>
        <KTCardBody className="py-4 mt-10">
          {/* <div className="card-body py-4">
					<Row>
						<div className="d-flex justify-content-end">

							<Link to="/order/list" className="btn btn-primary"><span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="currentColor"></rect><rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="currentColor"></rect></svg></span>Add Work Order</Link>

						</div>
					</Row>
				</div> */}

          <div className="table-responsive">
            <TableContainer
              columns={columns}
              data={data}
              sortBy={[{ id: "CreatedDateUtc" }]}
            />
          </div>
        </KTCardBody>
      </KTCard>
    </div>
  );
};

export default WorkOrderTable;
