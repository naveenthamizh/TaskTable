import { createContext, useContext, useReducer } from "react";
import {
  type TaskContextValue,
  type TaskState,
  type TaskAction,
  type TaskProviderProps,
} from "./types";

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const initialTaskState: TaskState = {
  tasks: [],
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

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {props?.children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextValue | undefined => {
  return useContext(TaskContext);
};
