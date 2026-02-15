import React, { type JSX } from "react";
import { classNames } from "../../utils";

import "./table.css";

export interface CellProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  isLoading?: boolean;
}

export interface RowProps {
  children: React.ReactNode;
  isTableHeader?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  gridTemplateColumns?: string;
  height?: string;
  isLoading?: boolean;
}

export interface TableProps {
  children: React.ReactNode;
  gridTemplateColumns: string;
  className?: string;
  isLoading?: boolean;
}

const Cell = (props: CellProps): JSX.Element => {
  const { children, onClick, className = "", isLoading } = props;

  return (
    <div
      className={`tableCell ${className}`}
      onClick={(event) => {
        if (onClick) {
          event.stopPropagation();
          onClick(event);
        }
      }}
    >
      {isLoading ? <div className="skeleton" /> : children}
    </div>
  );
};

const Row = (props: RowProps): JSX.Element => {
  const {
    onClick,
    className = "",
    gridTemplateColumns,
    height,
    isTableHeader,
    isLoading,
  } = props;

  return (
    <div
      className={classNames({
        tableRowWrapper: !isTableHeader,
        tableHeaderWrapper: !!isTableHeader,
        [className]: true,
      })}
      onClick={onClick}
      style={{
        gridTemplateColumns,
        height,
      }}
      role="row"
    >
      {React.Children.toArray(props?.children).map((child: any) =>
        React.cloneElement(child, {
          isLoading: isTableHeader ? false : isLoading,
        }),
      )}
    </div>
  );
};

export const Table = (props: TableProps): JSX.Element => {
  const { children, className, gridTemplateColumns, isLoading } = props;

  return (
    <div className={`tableWrapperForOverflow ${className}`}>
      <div
        className={`customTableWrapper `}
        style={{
          height: "inherit",
          width: "100%",
          gridTemplateColumns,
        }}
      >
        <div className={"gridTemplateColumnInherit"}>
          {React.Children.toArray(children).map((child: any) =>
            React.cloneElement(child, {
              isLoading,
            }),
          )}
        </div>
      </div>
    </div>
  );
};

Table.Row = React.memo(Row);
Table.Cell = React.memo(Cell);
