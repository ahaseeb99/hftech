import clsx from "clsx";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useLayout } from "../../../core/LayoutProvider";
import { usePageData } from "../../../core/PageData";
import { useSelector } from "react-redux";

const DefaultTitle: FC = () => {
  const { pageTitle, pageDescription, pageBreadcrumbs } = usePageData();
  const { config, classes } = useLayout();
  const user = useSelector((state: any) => state.auth.user);
  return (
    <div>
      <div
        id="kt_page_title"
        // data-kt-swapper="true"
        // data-kt-swapper-mode="prepend"
        // data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
        className={clsx("page-title", classes.pageTitle.join(" "))}
        style={{ display: "flex", justifyContent: "start" }}
      >
        {/* begin::Title */}
        {pageTitle && (
          <h1 className="d-flex align-items-center text-dark fw-bolder my-1 fs-3">
            {pageTitle}
            {pageDescription &&
              config.pageTitle &&
              config.pageTitle.description && (
                <>
                  <span className="h-20px border-gray-200 border-start ms-3 mx-2"></span>
                  <small className="text-muted fs-7 fw-bold my-1 ms-1">
                    {pageDescription}
                  </small>
                </>
              )}
          </h1>
        )}
        {/* end::Title */}

        {pageBreadcrumbs &&
          pageBreadcrumbs.length > 0 &&
          config.pageTitle &&
          config.pageTitle.breadCrumbs && (
            <>
              {config.pageTitle.direction === "row" && (
                <span className="h-20px border-gray-200 border-start mx-4"></span>
              )}
              <ul className="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
                {Array.from(pageBreadcrumbs).map((item, index) => (
                  <li
                    className={clsx("breadcrumb-item", {
                      "text-dark": !item.isSeparator && item.isActive,
                      "text-muted": !item.isSeparator && !item.isActive,
                    })}
                    key={`${item.path}${index}`}
                  >
                    {!item.isSeparator ? (
                      <Link
                        className="text-muted text-hover-primary"
                        to={item.path}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <span className="bullet bg-gray-200 w-5px h-2px"></span>
                    )}
                  </li>
                ))}
                <li className="breadcrumb-item text-dark">{pageTitle}</li>
              </ul>
            </>
          )}
      </div>

      <div
        className="align-items-center py-1 m-0"
        style={{ display: "flex", justifyContent: "end" }}
      >
        {pageTitle == "Estimates List" ? (
          (user?.role?.name == "ADMIN" || (user?.role?.permissions?.estimates?.includes('create'))) ? (
            <Link to="/estimates/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Estimate
          </Link>
          ) : null
        ) : ""}
        {pageTitle == "Clients List" ? (
          (user?.role?.name == "ADMIN" || (user?.role?.permissions?.clients?.includes('create'))) ? (
            <Link to="/client/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Client
          </Link> 
          ) : null
        ): ""}

        {pageTitle == "Locations List" ? (
          (user?.role?.name == "ADMIN" || (user?.permissions?.locations?.includes('create'))) ? (
            <Link to="/location/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Location
          </Link>
          ) : null
        ) : ""}

        {pageTitle == "Inventory List" ? (
          <Link to="/inventory/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Inventory
          </Link>
        ): ""}

        {pageTitle == "Contact List" ? (
           (user?.role?.name == "ADMIN" || (user?.permissions?.contacts?.includes('create'))) ? (
            <Link to="/contact/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Contact
          </Link>
           ) : null
        ): ""}
        {pageTitle === "Work Order List" ? (
          (user?.role?.name == "ADMIN" || (user?.role?.permissions?.workorders?.includes('create'))) ? (
            <Link to="/order/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Work Order
          </Link>
          ) : null
        ): ""}

        {pageTitle == "Users List" && user?.role?.name  === "ADMIN" ? (
          <Link to="/users/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add User
          </Link>
        ) : (
          ""
        )}
        {pageTitle == "Role List" && user?.role?.name === "ADMIN" ? (
          <Link to="/role/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Role
          </Link>
        ) : (
          ""
        )}
        
        {pageTitle == "Invoice List" && user?.role?.name === "ADMIN" ? (
          <Link to="/invoice/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Invoice
          </Link>
        ) : (
          ""
        )}
         {pageTitle == "Purchase Order List" && user?.role?.name === "ADMIN" ? (
          <Link to="/purchase/create" className="btn btn-sm btn-primary">
            <span className="svg-icon svg-icon-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mh-50px"
              >
                <rect
                  opacity="0.5"
                  x="11.364"
                  y="20.364"
                  width="16"
                  height="2"
                  rx="1"
                  transform="rotate(-90 11.364 20.364)"
                  fill="currentColor"
                ></rect>
                <rect
                  x="4.36396"
                  y="11.364"
                  width="16"
                  height="2"
                  rx="1"
                  fill="currentColor"
                ></rect>
              </svg>
            </span>
            Add Purchase Order
          </Link>
        ) : (
          ""
        )}

        {pageTitle == "Task List" ? (
          (user?.role?.name == "ADMIN" || (user?.role?.permissions?.tasks?.includes('create'))) ? (
            <Link to="/task/create" className="btn btn-sm btn-primary">
              <span className="svg-icon svg-icon-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mh-50px"
                >
                  <rect
                    opacity="0.5"
                    x="11.364"
                    y="20.364"
                    width="16"
                    height="2"
                    rx="1"
                    transform="rotate(-90 11.364 20.364)"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="4.36396"
                    y="11.364"
                    width="16"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                </svg>
              </span>
              Add Task
            </Link>) : ""
        ) : ""}
        {/* <a
          className='btn btn-sm btn-primary cursor-pointer'
          
        >
        </a> */}
      </div>

      
    </div>
  );
};

export { DefaultTitle };
