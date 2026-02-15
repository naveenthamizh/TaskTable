import { useEffect } from "react";
import { useTaskContext } from "../context/taskcontent";
import { LOCAL_STORAGE } from "../utils";
import type { Task } from "../context/types";
import { MOCK_DATA } from "../constants";

export const useTasks = () => {
  const { state, dispatch } = useTaskContext() || {};

  useEffect(() => {
    const stored_tasks: Task[] | null = LOCAL_STORAGE.get("dashboard_tasks");
    dispatch?.({
      type: "SET_TASKS",
      payload: stored_tasks?.length ? stored_tasks : (MOCK_DATA as Task[]),
    });
  }, []);

  useEffect(() => {
    LOCAL_STORAGE.set("dashboard_tasks", state?.tasks);
  }, [state?.tasks]);

  return {
    tasks: state?.tasks,
    dispatch,
  };
};
