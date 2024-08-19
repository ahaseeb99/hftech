import React from "react";
import { useIntl } from "react-intl";
import { AsideMenuItem } from "./AsideMenuItem";
import { useSelector } from "react-redux";

export function AsideMenuMain() {
  const intl = useIntl();
  const user = useSelector((state: any) => state.auth.user)
  console.log('user', user);

  return (
    <>
      {
        ((user?.role?.permissions?.calendar?.includes('list'))) && (
          <AsideMenuItem
            to="/calendar"
            fontIcon="bi-calendar-event"
            title={intl.formatMessage({ id: "MENU.CALENDAR" })}
          />
        )
      }
      
      {
        ((user?.role?.permissions?.contacts?.includes('list'))) && (
          <AsideMenuItem
          to="/contact/list"
          fontIcon="bi bi-person-rolodex"
          title="Contacts"
        />
        )
      }
      {
         ((user?.role?.permissions?.clients?.includes('list'))) && (
          <AsideMenuItem
          to="/client/list"
          fontIcon="bi-person-circle"
          title="Clients"
        />     
         )
      }
      {
        ((user?.role?.permissions?.estimates?.includes('list')))  &&
        <AsideMenuItem
        to="/estimates/list"
        fontIcon="bi-pencil-square"
        title="Estimates"
      />
      }
      {
        ((user?.role?.permissions?.locations?.includes('list'))) && (
          <AsideMenuItem
          to="/location/list"
          fontIcon="bi-geo-alt-fill"
          title="Locations"
        />
        )
      }
      
      {
        ((user?.role?.permissions?.users?.includes('list'))) &&
        <AsideMenuItem
          to="/users/list"
          fontIcon="bi bi-people-fill"
          title="Users"
        />
        }
      {
         ((user?.role?.permissions?.workorders?.includes('list'))) && (
          <AsideMenuItem
          to="/order/list"
          fontIcon="bi-briefcase-fill"
          title="Work Orders"
        />
         )
      }
      {
        (user?.role?.name === "ADMIN") &&
        <AsideMenuItem
          to="/invoice/list"
          fontIcon="bi bi-receipt"
          title="Invoices"
        />
      }
      {
        (user?.role?.name === "ADMIN") &&
        <AsideMenuItem
          to="/purchase/list"
          fontIcon="bi bi-cash"
          title="Purchase Order"
        />
      }
        {
         (user?.role?.name === "ADMIN") && (
          <AsideMenuItem
          to="/status-flag/list"
          fontIcon="bi bi-stickies-fill"
          title="Flag & Status"
        />
         )
      }
      {user?.role?.permissions?.tasks?.includes('list') && (
          <AsideMenuItem
            to="/task/list"
            fontIcon="bi bi-list-task"
            title="Tasks Manager"
          />
        )
      }
      {
         (user?.role?.name === "ADMIN") && (
          <AsideMenuItem
          to="/role/list"
          fontIcon="bi-briefcase-fill"
          title="Roles"
        />
         )
      }
    </>
  );
}
