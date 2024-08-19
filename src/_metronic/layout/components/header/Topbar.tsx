import clsx from "clsx";
import { FC } from "react";
import {
  HeaderUserMenu,

} from "../../../partials";


const toolbarButtonMarginClass = "ms-1 ms-lg-3",
  toolbarUserAvatarHeightClass = "symbol-30px symbol-md-40px"


const Topbar: FC = () => {

  return (
    <div className="d-flex align-items-stretch flex-shrink-0">
      <div
        className={clsx("d-flex align-items-center", toolbarButtonMarginClass)}
        id="kt_header_user_menu_toggle"
      >
        <div
          className={clsx(
            "cursor-pointer symbol HeaderAccountUser",
            toolbarUserAvatarHeightClass
          )}
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="bottom"
        >
          <span>
            Account
          </span>
          <i className="bi bi-person-fill p-0"/>
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  );
};

export { Topbar };
