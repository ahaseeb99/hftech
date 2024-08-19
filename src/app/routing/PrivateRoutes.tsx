import { lazy, FC, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { DashboardWrapper } from "../pages/dashboard/DashboardWrapper";
import { MenuTestPage } from "../pages/MenuTestPage";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import BuilderPageWrapper from "../pages/layout-builder/BuilderPageWrapper";
import Calendar from "../pages/calendar/Calendar";
import ClientsPage from "../pages/Client/ClientsPage";
import LocationsPage from "../pages/Location/LocationsPage";
import InventoryPage from "../pages/Inventory/InventoryPage";
import WorkOrderPage from "../pages/WorkOrder/WorkOrderPage";
import HFWorkOrderPage from "../pages/hfWorkorder/WorkOrderPage";
import { Registration } from "../modules/auth/components/Registration";
import ContactsPage from "../pages/contact/ContactsPage";
import UserPage from "../pages/Users/UserPage";
import RolesPage from "../pages/roles/RolesPage";
import InvoicesPages from "../pages/Invoices/InvoicesPages";
import PurchaseOrderPage from "../pages/purchaseOrder/PurchaseOrderPage";
import StatusPages from "../pages/Flag-Status/StatusPages";
import FlagStatusPages from "../pages/Flag-Status/Flag-StatusPages";
import FlagPages from "../pages/Flag-Status/FlagPages";
import LabelPages from "../pages/Flag-Status/LabelPages";
import TaskPages from "../pages/tasks/TaskPages";

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import("../modules/profile/ProfilePage"));
  const WizardsPage = lazy(() => import("../modules/wizards/WizardsPage"));
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"));
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"));
  const ChatPage = lazy(() => import("../modules/apps/chat/ChatPage"));
  const UsersPage = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  );
  const EstimatesPage = lazy(() => import("../pages/Estimates/EstimatesPage"));

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path="auth/*" element={<Navigate to="/calendar" />} />
        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="registration" element={<Registration />} />
        <Route
          path="task/*"
          element={
            <SuspensedView>
              <TaskPages />
            </SuspensedView>
          }
        />
        <Route
          path="estimates/*"
          element={
            <SuspensedView>
              <EstimatesPage />
            </SuspensedView>
          }
        />
        <Route
          path="role/*"
          element={
            <SuspensedView>
              <RolesPage />
            </SuspensedView>
          }
        />
        <Route
          path="status-flag/*"
          element={
            <SuspensedView>
              <FlagStatusPages />
            </SuspensedView>
          }
        />
        <Route
          path="status/*"
          element={
            <SuspensedView>
              <StatusPages />
            </SuspensedView>
          }
        />
        <Route
          path="label/*"
          element={
            <SuspensedView>
              <LabelPages />
            </SuspensedView>
          }
        />
        <Route
          path="flag/*"
          element={
            <SuspensedView>
              <FlagPages />
            </SuspensedView>
          }
        />
        <Route
          path="client/*"
          element={
            <SuspensedView>
              <ClientsPage />
            </SuspensedView>
          }
        />
        <Route
          path="location/*"
          element={
            <SuspensedView>
              <LocationsPage />
            </SuspensedView>
          }
        />

        <Route
          path="inventory/*"
          element={
            <SuspensedView>
              <InventoryPage />
            </SuspensedView>
          }
        />
        <Route
          path="invoice/*"
          element={
            <SuspensedView>
              <InvoicesPages />
            </SuspensedView>
          }
        />

        <Route
          path="purchase/*"
          element={
            <SuspensedView>
              <PurchaseOrderPage />
            </SuspensedView>
          }
        />
        {/* corrigo work order list route */}
        {/* <Route
          path="order/*"
          element={
            <SuspensedView>
              <WorkOrderPage />
            </SuspensedView>
          }
        /> */}

        <Route
          path="order/*"
          element={
            <SuspensedView>
              <HFWorkOrderPage />
            </SuspensedView>
          }
        />
        <Route
          path="contact/*"
          element={
            <SuspensedView>
              <ContactsPage />
            </SuspensedView>
          }
        />
        <Route
          path="users/*"
          element={
            <SuspensedView>
              <UserPage />
            </SuspensedView>
          }
        />
        <Route path="builder" element={<BuilderPageWrapper />} />
        <Route path="menu-test" element={<MenuTestPage />} />

        {/* Lazy Modules */}
        <Route
          path="crafted/pages/profile/*"
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/pages/wizards/*"
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/widgets/*"
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/chat/*"
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path="apps/user-management/*"
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--kt-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
