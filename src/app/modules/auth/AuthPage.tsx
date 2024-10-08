/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Registration } from "./components/Registration";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/resetPassword";
import { Login } from "./components/Login";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import Logo from "../../../assets/images/ic_logo.svg";

const AuthLayout = () => {
  useEffect(() => {
    document.body.classList.add("bg-body");
    return () => {
      document.body.classList.remove("bg-body");
    };
  }, []);

  return (
    <div
      className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
      style={
        {
          // backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
        }
      }
    >
      {/* begin::Content */}
      <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
        {/* begin::Logo */}
        <a href="#" className="mb-12">
          <img alt="Logo" src={Logo} className="h-45px" />
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div className="w-lg-500px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
          <Outlet />
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
    </div>
  );
};

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      {/*<Route path="registration" element={<Registration />} />*/}
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
);

export { AuthPage };
