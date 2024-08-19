import React from "react";
import { taskRefinementHTML, timezoneConverter } from "../../../../utils/helpers";
import { KTSVG } from "../../../../_metronic/helpers";

const BookMarkItem = ({ workOrderData, getWorkOrder, user }) => {
  let data = workOrderData;
  return (
    <>
      <div className="alert alert-secondary border-0 d-flex align-items-center p-5 mb-5" onClick={() => getWorkOrder(data?.Number)} style={{cursor: "pointer"}}>
        <div className="d-flex flex-column">
          <span className="text-black">{timezoneConverter(data?.ScheduledStartUtc, user.userTimezone)}{" "}
            <span className="cursor-pointer" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
              <KTSVG path="/media/svg/shapes/global.svg" />
            </span>
          </span>
          {/* <span className="text-black"><a target="_blank" href={`https://enterprise.corrigo.com/corpnet/workorder/workorderdetails.aspx/${data?.Id}`}>{data?.Number}</a></span> */}
          <span className="text-black"><a href={`/order/view/${data._id}`} >{data?.Number}</a></span>
          {/* <h5 className="mb-1">{data?.TaskRefinement}</h5> */}
          <span
                dangerouslySetInnerHTML={{
                  __html: taskRefinementHTML(data?.TaskRefinement,data.Labels),
                }}
                style={{ lineHeight: "2.5rem" }}
                className="fs-4 mt-2 text-black bagde-sm-child"
              />
        </div>
      </div>
    </>
  );
};

export default BookMarkItem;
