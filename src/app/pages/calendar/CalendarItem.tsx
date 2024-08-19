import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { timezoneTimeConverter } from "../../../utils/helpers";
import { useSelector } from "react-redux";

const localizer = momentLocalizer(moment);

const CalendarItem = ({ setDate, getWorkOrder, workOrderList }: any) => {
  const [workOrderEventList, setWorkOrderEventList] = useState<any>([]);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    let eventArray: any[] = [];
    if (workOrderList.length) {
      workOrderList.forEach((data: any) => {
        let obj = {
          title: (
            <div
              onClick={() => getWorkOrder(data.Number)} 
              className="getWorkOrderNumber"
              data-toggle="tooltip" data-placement="top" title={`${timezoneTimeConverter(data?.ScheduledStartUtc,user?.userTimezone)} ${data?.Number} ${data?.TaskRefinement?.replace(/<\/?[^>]+(>|$)/g, "")}`}
            >
              <span>{data?.TaskRefinement}</span>
              <span
                className={`${data.PoNumber ? "Completed" : "InProgress"}`}
              >
                PO
              </span>
            </div>
          ),
          allDay: false,
          start: moment(data.ScheduledStartUtc),
          end: moment(data.ScheduledStartUtc),
        };
        if (data.ScheduledStartUtc) eventArray.push(obj);
      });
      setWorkOrderEventList(eventArray);
    }
  }, [workOrderList]);


  return (
    <div className="card card-xl-stretch mb-xl-8">
      <div className="card-body p-5">
        <Calendar
          popup={true}
          localizer={localizer}
          events={workOrderEventList || []}
          views={["month"]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onNavigate={(date) => {
            setDate(date);
            console.info("date =>", date);
          }}
        />
      </div>
    </div>
  );
};

export default CalendarItem;
