import React, { useEffect, useState } from "react";
import BookMarkItem from "./BookMarkItem";

const BookMark = ({ user, date, workOrderList, getWorkOrder }) => {
  console.log("Our date : ", date);

  return (
    <div className="card card-xl-stretch mb-xl-8">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-dark">Work Orders</span>
        </h3>
      </div>
      <div className="card-body pt-5">
        {!workOrderList.length ? (
          <div className="alert alert-secondary border-0 d-flex align-items-center p-5 mb-5">
            <div className="d-flex flex-column">
              <h6 className="mb-1">
                {"There are no bookmarks in this month."}
              </h6>
            </div>
          </div>
        ) : (
          workOrderList.map((item, i) => (
            <BookMarkItem key={i} workOrderData={item} user={user} getWorkOrder={getWorkOrder}/>
          ))
        )}
      </div>
    </div>
  );
};

export default BookMark;
