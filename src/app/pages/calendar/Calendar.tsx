import React, { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { useIntl } from "react-intl";
import BookMark from "./BookMark/BookMark";
import CalendarItem from "./CalendarItem";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import WorkOrderDetail from "./BookMark/WorkOrderDetail";
import { ACTION_getMonthlyWorkOrders } from "../../../store/workorder/actions";

const Calendar: React.FC = () => {
  const dispatch: any = useDispatch();
  const intl = useIntl();
  const [date, setDate] = useState(moment());
  const { monthlyWorkorderList } = useSelector((state: any) => state.workOrder);
  const { user } = useSelector((state: any) => state.auth);

  const [filterBookMarks, setFilterBookMarks] = useState<any[]>([]);
  const [currentWorkOrder, setCurrentWorkOrder] = useState<any>({});

  useEffect(() => {
    if(date) {
      const startOfMonth = moment(date).startOf('month');
      const endOfMonth  = moment(date).endOf('month');
      const subStartDateOfMonth = startOfMonth.subtract(15,"days").format('YYYY-MM-DD')
      const addEndDateOfMonth = endOfMonth.add(15,"days").format('YYYY-MM-DD') 
      dispatch(ACTION_getMonthlyWorkOrders(subStartDateOfMonth, addEndDateOfMonth ));
    }
  },[date])

  

  useEffect(() => {
    if (monthlyWorkorderList?.length) {
      let newList = monthlyWorkorderList?.filter((item) => {
        if (item?.ScheduledStartUtc) {
          let compareDate = moment(item?.ScheduledStartUtc);
          return compareDate.isSame(date, "month");
        } else {
          return false;
        }
      });

      //   console.log(newList[0].Data.DtCreated);
      const updatedNewList = newList?.sort(
        (a: any, b: any) =>{
            return new Date(b?.ScheduledStartUtc).getTime() -
              new Date(a?.ScheduledStartUtc).getTime()
        }
      );
      setFilterBookMarks(updatedNewList);
      setCurrentWorkOrder({});
      console.info("----------------------------");
      console.info("updatedNewList =>", updatedNewList);
      console.info("----------------------------");
    }
  }, [monthlyWorkorderList, date]);

  const getWorkOrder = (workOrderNumber: string) => {
    // console.log("WORK Number : ", workOrderNumber);
    const workOrder = monthlyWorkorderList.find(
      (wo) => wo.Number === workOrderNumber
    );
    // console.log({ workOrder });
    setCurrentWorkOrder(workOrder);
  };

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.CALENDAR" })}
      </PageTitle>
      <div>
        <div className="row gy-5 g-xl-8">
          <div className="col-xxl-6">
            <CalendarItem
              setDate={setDate}
              getWorkOrder={getWorkOrder}
              workOrderList={monthlyWorkorderList}
            />
          </div>
          <div className="col-xxl-6">
            {currentWorkOrder?.Number ? (
              <WorkOrderDetail user={user} workOrderData={currentWorkOrder} />
            ) : (
              filterBookMarks.length > 0 && (
                <BookMark
                  user={user}
                  date={date}
                  workOrderList={filterBookMarks}
                  getWorkOrder={getWorkOrder}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
