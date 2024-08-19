import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { I18nProvider } from "../_metronic/i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { AuthInit } from "./modules/auth";
import "./index.css";
const App = () => {
  // const dispatch: any = useDispatch();
  // if (localStorage.authToken && localStorage.userData) {
  //   dispatch(
  //     setCurrentUser(localStorage.authToken, JSON.parse(localStorage.userData))
  //   );
  // }
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          {/* <AuthInit> */}
          <Outlet />
          <MasterInit />
          {/* </AuthInit> */}
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  );
};

export { App };
