export type TaskStatus = "pending" | "in_progress" | "completed" | "all";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: number;
  createdAt: number;
}

export type TaskFilterStatus = TaskStatus | "ALL";

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "SET_TASKS"; payload: Task[] };

export interface TaskState {
  tasks: Task[];
}

export interface TaskContextValue {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
}

export type TaskProviderProps = {
  children: React.ReactNode;
};
