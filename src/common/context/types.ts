export type TaskStatus = "pending" | "in_progress" | "completed" | "all";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: number;
  createdAt: number;
}

type SortKey = "createdAt" | "dueDate";

export type TaskState = {
  tasks: Task[];
  filterStatus: TaskStatus;
  sortKey?: SortKey;
  sortOrder: "asc" | "desc";
};

export type TaskAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "SET_FILTER"; payload: TaskStatus }
  | {
      type: "SET_SORT";
      payload: { key: SortKey; order: "asc" | "desc" };
    };

export interface TaskContextValue {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

export type TaskProviderProps = {
  children: React.ReactNode;
};
