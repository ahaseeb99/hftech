import moment from "moment";
import { useSelector } from "react-redux";


function useUserTz(datetimeUTC) {
  const { user: { userTimezone } } = useSelector((state: any) => state.auth);

  console.log("useUserTz", userTimezone, datetimeUTC);
  // moment.tz(formik.values.scheduleTo, user.userTimezone).tz('UTC');
  const format = () => {
    return moment.tz(datetimeUTC, 'UTC').tz(userTimezone).format();
  }
  return [format];
}

export default useUserTz;