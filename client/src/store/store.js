import { configureStore } from "@reduxjs/toolkit";
import regionReducer from "./ActionReducers/regionReducer";
import clientReducer from "./ActionReducers/clientReducer";
import teamReducer from "./ActionReducers/teamReducer";
import userReducer from "./ActionReducers/userReducer";
import workerReducer from "./ActionReducers/workerReducer";
import taskReducer from "./ActionReducers/taskReducer";
import upcommingTaskReducer from './ActionReducers/upcommingTaskReducer'
import missedTasksReducer from './ActionReducers/missedTasksReducer'
import liveTrackingReducer from "./ActionReducers/liveTrackingReducer";
import feedbackReducer from "./ActionReducers/feedbackReducer";


export const store = configureStore({
  reducer: {
    // Redux for CRUD
    client: clientReducer,
    region: regionReducer,
    team: teamReducer,
    user: userReducer,
    worker: workerReducer,
    
    // Redux for Read, Update
    task: taskReducer,
    upcommingTask: upcommingTaskReducer,
    missedTask: missedTasksReducer,
    liveTracking:liveTrackingReducer,
    feedback:feedbackReducer,
  },
});
