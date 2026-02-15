import { useMemo, useState, type JSX } from "react";

import { IconEdit } from "../../../../common/icons/IconEdit";
import { IconDelete } from "../../../../common/icons/IconDelete";
import { IconSort } from "../../../../common/icons/IconSort";

import { Label, LABEL_VARIANTS } from "../../../../common/components/label";
import { PageSelector } from "../../../../common/components/pagination";
import { Table } from "../../../../common/components/table";
import { Button, BUTTON_TYPES } from "../../../../common/components/Button";
import { RenderWhen } from "../../../../common/hoc/Renderwhen";

import { getTimeFormat, getTitle } from "../../../../common/utils";
import { useTasks } from "../../../../common/hooks/useTasks";
import { filter_options } from "../../../../common/constants";

import { DeleteTaskModal, FormModal } from "../FormModal";
import { TaskBoardActions } from "../TaskboardActions";

import type { Task } from "../../../../common/context/types";

import styles from "./tasktable.module.css";

const table_header = [
  { value: "selector", label: "#" },
  { value: "name_description", label: "Name & Description" },
  { value: "createdAt", label: "Created At", sort: true },
  { value: "dueDate", label: "Due Date", sort: true },
  { value: "status", label: "Status" },
  { value: "action", label: "Action" },
];

const ROWS_PER_PAGE = 10;

export const TaskTable = (): JSX.Element => {
  const { tasks, dispatch, state } = useTasks();

  const [page, setPage] = useState(1);
  const [form, setForm] = useState<Task | undefined>();
  const [uiState, setUIState] = useState({
    deleteModal: false,
    editModal: false,
    createModal: false,
  });

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return tasks.slice(start, start + ROWS_PER_PAGE);
  }, [tasks, page]);

  return (
    <>
      <TaskBoardActions
        status={
          filter_options.find((opt) => opt.value === state?.filterStatus) ||
          filter_options[0]
        }
        setStatus={(value) => {
          setPage(1);
          dispatch?.({
            type: "SET_FILTER",
            payload: value.value,
          });
        }}
      />
      <RenderWhen.If isTrue={!!state?.tasks?.length}>
        <div className={styles.taskboard_tableContainer}>
          <Table
            gridTemplateColumns={`50px repeat(${table_header.length - 1},minmax(250px,1fr))`}
          >
            <Table.Row isTableHeader>
              {table_header.map((header) => (
                <Table.Cell key={header.value}>
                  <div className={styles.header_container}>
                    <span>{header.label}</span>
                    {header.sort && (
                      <span
                        className={styles.iconSort}
                        onClick={() =>
                          dispatch?.({
                            type: "SET_SORT",
                            payload: {
                              key: header.value as "createdAt" | "dueDate",
                              order:
                                state?.sortOrder === "asc" ? "desc" : "asc",
                            },
                          })
                        }
                      >
                        <IconSort size="14" />
                      </span>
                    )}
                  </div>
                </Table.Cell>
              ))}
            </Table.Row>

            {paginatedTasks.map((task, index) => (
              <Table.Row key={task.id}>
                <Table.Cell>
                  {index + 1 + (page - 1) * ROWS_PER_PAGE}
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

                <Table.Cell className={styles.actionBtn}>
                  <div
                    onClick={() => {
                      setForm(task);
                      setUIState((p) => ({ ...p, editModal: true }));
                    }}
                  >
                    <IconEdit size="14" />
                  </div>
                  <div
                    onClick={() => {
                      setForm(task);
                      setUIState((p) => ({ ...p, deleteModal: true }));
                    }}
                  >
                    <IconDelete />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table>

          <PageSelector
            totalPages={Math.ceil(tasks.length / ROWS_PER_PAGE)}
            currentPage={page}
            onPageChange={setPage}
            siblingCount={1}
          />
        </div>
      </RenderWhen.If>
      <RenderWhen.If isTrue={!state?.tasks?.length}>
        <div className={styles.emptyState}>
          <RenderWhen.If isTrue={!state?.tasks.length}>
            <>
              <div>Uh-oh, Task's Not found</div>
              <Button
                type={BUTTON_TYPES.PRIMARY}
                onClick={() => setUIState((p) => ({ ...p, createModal: true }))}
              >
                Create Task
              </Button>
            </>
          </RenderWhen.If>
          <RenderWhen.If isTrue={!!state?.tasks.length}>
            <div>No tasks for selected filter</div>
          </RenderWhen.If>
        </div>
      </RenderWhen.If>
      {uiState.editModal && (
        <FormModal
          formType="edit"
          formData={form}
          onClose={() => setUIState((p) => ({ ...p, editModal: false }))}
        />
      )}

      {uiState.createModal && (
        <FormModal
          formType="create"
          onClose={() => setUIState((p) => ({ ...p, createModal: false }))}
        />
      )}

      {uiState.deleteModal && (
        <DeleteTaskModal
          id={form?.id || ""}
          onClose={() => setUIState((p) => ({ ...p, deleteModal: false }))}
        />
      )}
    </>
  );
};
