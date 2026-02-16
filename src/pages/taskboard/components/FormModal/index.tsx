import { useState, type JSX } from "react";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";

import { Modal, MODAL_TYPES } from "../../../../common/components/Modal";
import { TextInput } from "../../../../common/components/TextInput";
import { TextAreaInput } from "../../../../common/components/TextAreaInput";
import { DatePicker } from "../../../../common/components/DatePicker";
import { SingleSelect } from "../../../../common/components/SingleSelect";

import { useTasks } from "../../../../common/hooks/useTasks";

import type { Task } from "../../../../common/context/types";

import styles from "./formmmodal.module.css";
import {
  MESSAGE_BAR_TYPES,
  showMessageBar,
} from "../../../../common/components/MessageBar";

type FormModalProps = {
  formType: "create" | "edit";
  formData?: Task;
  onClose: () => void;
};

const sample_options = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export const FormModal = (props: FormModalProps): JSX.Element => {
  const { formType, formData, onClose } = props;

  const { dispatch } = useTasks();

  const [task, setTask] = useState<Task>(
    (formData ?? { dueDate: Date.now() }) as Task,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTask = <T extends keyof Task>(key: T, value: Task[T]) => {
    setTask(
      produce(task, (draft) => {
        draft[key] = value;
      }),
    );
  };

  const isCreate = formType === "create";

  const onSavingForm = () => {
    if (isCreate) {
      const id = uuidv4();
      dispatch?.({
        type: "ADD_TASK",
        payload: {
          ...task,
          id,
          createdAt: Date.now(),
          status: task?.status || "pending",
        },
      });
      showMessageBar({
        type: MESSAGE_BAR_TYPES.SUCCESS,
        heading: "Task Created Successfully",
      });
    } else {
      dispatch?.({ type: "UPDATE_TASK", payload: task });
      showMessageBar({
        type: MESSAGE_BAR_TYPES.SUCCESS,
        heading: "Task Updated Successfully",
      });
    }
    onClose();
  };

  function validateTask() {
    const errors: Record<string, string> = {};
    let hasError = false;

    if (!task.title?.trim()) {
      errors.title = "Name is required";
      hasError = true;
    }

    if (!task.dueDate) {
      errors.dueDate = "Due date is required";
      hasError = true;
    }

    return { errors, hasError };
  }

  return (
    <Modal
      open
      title={isCreate ? "Create Task" : "Edit Task"}
      closable
      onClose={onClose}
      onCancel={onClose}
      okText={isCreate ? "Create" : "Update"}
      onOK={() => {
        const validate = validateTask();

        if (validate?.hasError) {
          setErrors(validate?.errors);
        } else {
          onSavingForm();
        }
      }}
    >
      <div className={styles.modal_container}>
        <TextInput
          tabIndex={1}
          label="Name"
          required
          value={task?.title}
          onBlur={(value) => handleTask("title", value)}
          error={errors?.title}
        />
        <TextAreaInput
          tabIndex={2}
          label="Description"
          value={task?.description}
          onBlur={(value) => handleTask("description", value)}
        />
        <DatePicker
          required
          tabIndex={3}
          value={task?.dueDate}
          label="Due Date"
          onChange={(value) => {
            if (value) handleTask("dueDate", value);
          }}
          error={errors?.dueDate}
        />
        <SingleSelect
          tabIndex={4}
          label="Status"
          placeholder="Select status"
          value={
            sample_options?.find((op) => op.value === task?.status) ??
            sample_options[0]
          }
          options={sample_options}
          uniqueKey="value"
          displayKey="label"
          onSelect={(value) => {
            handleTask("status", value?.value);
          }}
        />
      </div>
    </Modal>
  );
};

type DeleteTaskModalProps = {
  onClose: () => void;
  id: string;
};

export const DeleteTaskModal = (props: DeleteTaskModalProps) => {
  const { onClose, id } = props;
  const { dispatch } = useTasks();
  return (
    <Modal
      open
      title="Delete Task"
      okText="Delete"
      closable
      type={MODAL_TYPES.DANGER}
      onClose={() => {
        onClose();
      }}
      onCancel={() => {
        onClose();
      }}
      onOK={() => {
        dispatch?.({
          type: "DELETE_TASK",
          payload: { id: id || "" },
        });
        onClose();
      }}
    >
      <div className={styles.modal_container}>
        Are you sure want to delete task?
      </div>
    </Modal>
  );
};
