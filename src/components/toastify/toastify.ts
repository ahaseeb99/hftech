import { ReactText } from "react";
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const options: ToastOptions = {
  position: `top-right`,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    zIndex: 99,
  },
};

const Success = (message: string): ReactText => toast.success(message, options);
const Info = (message: string): ReactText => toast.info(message, options);
const Warn = (message: string): ReactText => toast.warn(message, options);
const Error = (message: string): ReactText => toast.error(message, options);
const Dark = (message: string): ReactText => toast.dark(message, options);
const Default = (message: string): ReactText => toast(message, options);
export const toastify = { Success, Info, Warn, Error, Dark, Default };
