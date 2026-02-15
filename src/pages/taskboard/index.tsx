import { type JSX } from "react";

import { CountDashboard } from "./components/countdashboard";
import { TaskTable } from "./components/TaskTable";

import styles from "./taskboard.module.css";

export const TaskBoard = (): JSX.Element => {
  return (
    <section className={styles.taskboard_container}>
      <div className={styles.taskboard_header}>
        <div className={styles.taskboard_title}>Task Management</div>
      </div>
      <div className={styles.overview_container}>
        <CountDashboard />
        <div className={styles.taskboard_content}>
          <TaskTable />
        </div>
      </div>
    </section>
  );
};
