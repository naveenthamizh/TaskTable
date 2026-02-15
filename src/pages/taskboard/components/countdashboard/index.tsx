import { useMemo, type JSX } from "react";

import { useTasks } from "../../../../common/hooks/useTasks";

import { IconPending } from "../../../../common/icons/IconPending";
import { IconProgress } from "../../../../common/icons/IconProgress";
import { IconCheck } from "../../../../common/icons/IconCheck";
import { IconSummation } from "../../../../common/icons/IconSummation";

import type { TaskStatus } from "../../../../common/context/types";
import styles from "./countdashboard.module.css";

export const count_dashboard_list: Array<{
  label: string;
  value: TaskStatus;
  icon: React.ReactNode;
}> = [
  {
    label: "Total Tasks",
    value: "all",
    icon: <IconSummation size="30" color="var(--primary-base)" />,
  },
  {
    label: "Pending",
    value: "pending",
    icon: <IconPending size="30" color="var(--warning-base)" />,
  },
  {
    label: "In Progress",
    value: "in_progress",
    icon: <IconProgress size="30" color="var(--info-base)" />,
  },
  {
    label: "Completed",
    value: "completed",
    icon: <IconCheck size="30" color="var(--success-base)" />,
  },
];

export const CountDashboard = (): JSX.Element => {
  const { tasks } = useTasks();

  const status_counts = useMemo(() => {
    const taskCount = (type: TaskStatus) =>
      tasks?.filter((item) => item.status === type)?.length;

    return {
      pending: taskCount("pending") || 0,
      completed: taskCount("completed") || 0,
      in_progress: taskCount("in_progress") || 0,
      all: tasks?.length || 0,
    };
  }, [tasks]);

  const updateQuery = (status?: TaskStatus) => {
    const url = new URL(window.location.href);

    if (status) {
      url.searchParams.set("status", status);
    } else {
      url.searchParams.delete("status");
    }

    window.history.pushState({}, "", url.toString());
  };

  return (
    <section className={styles.dashboardContainer}>
      {count_dashboard_list?.map((list) => (
        <div
          className={styles.statsContainer}
          onClick={() => {
            updateQuery(list?.value);
          }}
        >
          {list?.icon}
          <div className={styles.header}>
            <span>{list?.label}</span>
            <div className={styles.counts}>{status_counts[list.value]}</div>
          </div>
        </div>
      ))}
    </section>
  );
};
