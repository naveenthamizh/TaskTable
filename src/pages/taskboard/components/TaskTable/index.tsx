import { useEffect, useMemo, useState, type JSX } from "react";
import styles from "./tasktable.module.css";

import { Label, LABEL_VARIANTS } from "../../../../common/components/label";
import { PageSelector } from "../../../../common/components/pagination";
import { Table } from "../../../../common/components/table";
import { getTimeFormat, getTitle } from "../../../../common/utils";
import { useTasks } from "../../../../common/hooks/useTasks";
import { TaskBoardActions } from "../TaskboardActions";
import { IconSort } from "../../../../common/icons/IconSort";
import type { Task, TaskStatus } from "../../../../common/context/types";
import { FormModal } from "../FormModal";
import { Modal, MODAL_TYPES } from "../../../../common/components/Modal";
import { filter_options } from "../../../../common/constants";
import { IconEdit } from "../../../../common/icons/IconEdit";
import { IconDelete } from "../../../../common/icons/IconDelete";
import { Button, BUTTON_TYPES } from "../../../../common/components/Button";
import { RenderWhen } from "../../../../common/hoc/Renderwhen";

const table_header = [
  { value: "selector", label: "#" },
  { value: "name_description", label: "Name & Description" },
  { value: "createdAt", label: "Created At", sort: true },
  { value: "dueDate", label: "Due Date", sort: true },
  { value: "status", label: "Status" },
  { value: "action", label: "Action" },
];

type SortKey = "createdAt" | "dueDate" | "filterBy";
type SortOrder = "asc" | "desc" | TaskStatus;

const ROWS_PER_PAGE = 10;

export const TaskTable = (): JSX.Element => {
  const { tasks, dispatch } = useTasks();

  const [tableState, setTableState] = useState({
    page: 1,
    sort: "asc" as SortOrder,
    status: filter_options[0],
  });

  const [taskState, setTaskState] = useState<{
    modifiedTask: Task[];
    form?: Task;
  }>({
    modifiedTask: [],
  });

  const [uiState, setUIState] = useState({
    deleteModal: false,
    editModal: false,
    createModal: false,
  });

  useEffect(() => {
    setTaskState((prev) => ({
      ...prev,
      modifiedTask: tasks || [],
    }));
  }, [tasks]);

  const sortFilterBy = (key: SortKey, order: SortOrder) => {
    setTableState((prev) => ({ ...prev, page: 1 }));

    if (key === "filterBy") {
      const updated =
        order === "all"
          ? tasks || []
          : tasks?.filter((item) => item.status === order) || [];

      setTaskState((prev) => ({
        ...prev,
        modifiedTask: updated,
      }));
      return;
    }

    setTableState((prev) => ({ ...prev, sort: order }));

    setTaskState((prev) => {
      const sorted = [...prev.modifiedTask].sort((a, b) =>
        order === "asc" ? a[key] - b[key] : b[key] - a[key],
      );
      return { ...prev, modifiedTask: sorted };
    });
  };

  const paginatedTasks = useMemo(() => {
    const start = (tableState.page - 1) * ROWS_PER_PAGE;
    return taskState.modifiedTask.slice(start, start + ROWS_PER_PAGE);
  }, [taskState.modifiedTask, tableState.page]);

  return (
    <>
      <TaskBoardActions
        status={tableState.status}
        setStatus={(value) => {
          setTableState((prev) => ({ ...prev, status: value }));
          sortFilterBy("filterBy", value?.value);
        }}
      />

      {taskState.modifiedTask.length ? (
        <div className={styles.taskboard_tableContainer}>
          <Table
            gridTemplateColumns={`50px repeat(${table_header.length - 1},minmax(250px,1fr))`}
          >
            <Table.Row isTableHeader>
              {table_header.map((header) => (
                <Table.Cell key={header.value}>
                  <div className={styles.header_container}>
                    <div>{header.label}</div>
                    {header.sort && (
                      <div
                        className={styles.iconSort}
                        onClick={() =>
                          sortFilterBy(
                            header.value as SortKey,
                            tableState.sort === "asc" ? "desc" : "asc",
                          )
                        }
                      >
                        <IconSort size="14" />
                      </div>
                    )}
                  </div>
                </Table.Cell>
              ))}
            </Table.Row>

            {paginatedTasks.map((task, index) => (
              <Table.Row
                key={task.id}
                onClick={() => {
                  setTaskState((prev) => ({ ...prev, form: task }));
                  setUIState((prev) => ({ ...prev, editModal: true }));
                }}
              >
                <Table.Cell>
                  {index + 1 + (tableState.page - 1) * ROWS_PER_PAGE}
                </Table.Cell>

                <Table.Cell>
                  <div className={styles.task_name_description}>
                    <div>{task.title}</div>
                    <div className={styles.overflow}>{task.description}</div>
                  </div>
                </Table.Cell>

                <Table.Cell>{getTimeFormat(task.createdAt)}</Table.Cell>
                <Table.Cell>{getTimeFormat(task.dueDate)}</Table.Cell>

                <Table.Cell>
                  <Label
                    content={getTitle(task.status)}
                    variant={
                      task.status === "in_progress"
                        ? LABEL_VARIANTS.INFO
                        : task.status === "pending"
                          ? LABEL_VARIANTS.WARNING
                          : LABEL_VARIANTS.SUCCESS
                    }
                  />
                </Table.Cell>

                <Table.Cell
                  className={styles.actionBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    onClick={() => {
                      setTaskState((prev) => ({ ...prev, form: task }));
                      setUIState((prev) => ({ ...prev, editModal: true }));
                    }}
                  >
                    <IconEdit size="14" />
                  </div>
                  <div
                    onClick={() => {
                      setTaskState((prev) => ({ ...prev, form: task }));
                      setUIState((prev) => ({ ...prev, deleteModal: true }));
                    }}
                  >
                    <IconDelete />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>

          <PageSelector
            totalPages={Math.ceil(
              taskState.modifiedTask.length / ROWS_PER_PAGE,
            )}
            currentPage={tableState.page}
            onPageChange={(page) =>
              setTableState((prev) => ({ ...prev, page }))
            }
            siblingCount={1}
          />
        </div>
      ) : (
        <div className={styles.emptyState}>
          <RenderWhen.If isTrue={!tasks?.length}>
            <>
              <div>Uh-oh, Task's Not found</div>
              <Button
                type={BUTTON_TYPES.PRIMARY}
                onClick={() =>
                  setUIState((prev) => ({ ...prev, createModal: true }))
                }
              >
                Create Task
              </Button>
            </>
          </RenderWhen.If>
          <RenderWhen.If isTrue={!!tasks?.length}>
            <RenderWhen.If isTrue={!taskState?.modifiedTask?.length}>
              <div>{tableState.status.label} task doesn't exist</div>
            </RenderWhen.If>
          </RenderWhen.If>
        </div>
      )}

      {uiState.editModal && (
        <FormModal
          formType="edit"
          formData={taskState.form}
          onClose={() => {
            setTaskState((prev) => ({ ...prev, form: undefined }));
            setUIState((prev) => ({ ...prev, editModal: false }));
          }}
        />
      )}

      {uiState.createModal && (
        <FormModal
          formType="create"
          onClose={() =>
            setUIState((prev) => ({ ...prev, createModal: false }))
          }
        />
      )}

      {uiState.deleteModal && (
        <Modal
          open
          title="Delete Task"
          okText="Delete"
          type={MODAL_TYPES.DANGER}
          onOK={() => {
            dispatch?.({
              type: "DELETE_TASK",
              payload: { id: taskState.form?.id || "" },
            });
            setUIState((prev) => ({ ...prev, deleteModal: false }));
          }}
          onClose={() =>
            setUIState((prev) => ({ ...prev, deleteModal: false }))
          }
        >
          Are you sure want to delete task?
        </Modal>
      )}
    </>
  );
};
