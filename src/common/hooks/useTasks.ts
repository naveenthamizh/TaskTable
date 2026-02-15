import { useEffect, useMemo } from "react";
import { useTaskContext } from "../context/taskcontent";
import { MOCK_DATA } from "../constants";
import type { Task, TaskStatus } from "../context/types";
import { LOCAL_STORAGE } from "../utils";

export const useTasks = () => {
  const context = useTaskContext();
  const { tasks, filterStatus, sortKey, sortOrder } = context?.state || {};

  const filteredTasks = useMemo(() => {
    let result = [...(tasks || [])];

    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus);
    }

    if (sortKey) {
      result.sort((a, b) =>
        sortOrder === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey],
      );
    }

    return result;
  }, [tasks, filterStatus, sortKey, sortOrder]);

  useEffect(() => {
    const syncFilterFromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");

      const validStatuses = ["pending", "in_progress", "completed"];

      context?.dispatch?.({
        type: "SET_FILTER",
        payload: (status && validStatuses.includes(status)
          ? status
          : "all") as TaskStatus,
      });
    };

    // initial sync
    syncFilterFromQuery();

    // 🔥 listen to ALL url changes
    window.addEventListener("urlchange", syncFilterFromQuery);

    return () => {
      window.removeEventListener("urlchange", syncFilterFromQuery);
    };
  }, []);

  useEffect(() => {
    const stored_tasks: Task[] | null = LOCAL_STORAGE.get("dashboard_tasks");
    context?.dispatch?.({
      type: "SET_TASKS",
      payload: stored_tasks?.length ? stored_tasks : (MOCK_DATA as Task[]),
    });
  }, []);

  useEffect(() => {
    LOCAL_STORAGE.set("dashboard_tasks", context?.state?.tasks);
  }, [context?.state?.tasks]);

  return {
    taskRef: tasks,
    tasks: filteredTasks,
    dispatch: context?.dispatch,
    state: context?.state,
  };
};
