import { useEffect, useState, type JSX } from "react";

import styles from "./taskboard.action.module.css";
import { Button, BUTTON_TYPES } from "../../../../common/components/Button";
import { FormModal } from "../FormModal";
import { SingleSelect } from "../../../../common/components/SingleSelect";
import type { TaskStatus } from "../../../../common/context/types";
import { filter_options } from "../../../../common/constants";

type TaskActionProps = {
  status?: { label: string; value: string };
  setStatus: (value: { label: string; value: TaskStatus }) => void;
};

export const TaskBoardActions = (props: TaskActionProps): JSX.Element => {
  const { setStatus, status } = props;
  const [modal, setModal] = useState<boolean>(false);

  return (
    <section className={styles.taskboard_content_header}>
      <div className={styles.taskboard_header_menu}>
        <SingleSelect
          fullWidth
          minWidth=""
          placeholder="Filter by status"
          value={status}
          options={filter_options}
          uniqueKey="value"
          displayKey="label"
          onSelect={setStatus}
        />

        <Button type={BUTTON_TYPES.PRIMARY} onClick={() => setModal(true)}>
          Create Task
        </Button>
      </div>
      {modal && <FormModal formType="create" onClose={() => setModal(false)} />}
    </section>
  );
};
