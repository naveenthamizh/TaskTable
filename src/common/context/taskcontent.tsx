import { createContext, useContext, useEffect, useReducer } from "react";
import {
  type TaskContextValue,
  type TaskState,
  type TaskAction,
  type TaskProviderProps,
  type Task,
} from "./types";
import isEqual from "lodash/isEqual";
import { MOCK_DATA } from "../constants";
import { LOCAL_STORAGE } from "../utils";

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const initialTaskState: TaskState = {
  tasks: (LOCAL_STORAGE.get("dasboard_tasks") ?? []) as Task[],
  filterStatus: "all",
  sortKey: undefined,
  sortOrder: "asc",
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "SET_TASKS":
      return { ...state, tasks: action.payload };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };

    case "SET_FILTER":
      return { ...state, filterStatus: action.payload };

    case "SET_SORT":
      return {
        ...state,
        sortKey: action.payload.key,
        sortOrder: action.payload.order,
      };

    default:
      return state;
  }
}

export const TaskProvider = (props: TaskProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  useEffect(() => {
    const storedTasks: Task[] | null = LOCAL_STORAGE.get("dashboard_tasks");
    dispatch({
      type: "SET_TASKS",
      payload: storedTasks?.length ? storedTasks : (MOCK_DATA as Task[]),
    });
  }, []);
  useEffect(() => {
    const storedTasks: Task[] | null = LOCAL_STORAGE.get("dashboard_tasks");
    if (state?.tasks?.length && !isEqual(state.tasks, storedTasks)) {
      LOCAL_STORAGE.set("dashboard_tasks", state.tasks);
    }
  }, [state.tasks]);
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {props?.children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextValue | undefined => {
  return useContext(TaskContext);
};
