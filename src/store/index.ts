import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import { logger } from "redux-logger";
import { authReducer } from "./auth/reducers";
import { estimateReducer } from "./estimate/reducers";
import { locationReducer } from "./location/reducers";
import { clientsReducer } from "./client/reducers";
import { workOrderReducer } from "./workorder/reducers";
import { contactsReducer } from "./contact/reducers";
import { usersReducer } from "./users/reducers";
import { roleReducer } from "./roles/reducers";
import { invoiceReducer } from "./invoice/reducers";
import { purchaseReducer } from "./purchaseorder/reducer";
import { flagStatusReducer } from "./status-flag/reducers";
import { taskReducer } from "./task/reduce";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  estimate: estimateReducer,
  location: locationReducer,
  client: clientsReducer,
  workOrder: workOrderReducer,
  contacts: contactsReducer,
  users: usersReducer,
  roles: roleReducer,
  invoices : invoiceReducer,
  purchase : purchaseReducer,
  flagStatus : flagStatusReducer,
  task: taskReducer
});

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, logger))
);
