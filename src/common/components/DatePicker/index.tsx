import dayjs from "dayjs";
import styles from "./datepicker.module.css";
import { classNames } from "../../utils";
import { useEffect, useState } from "react";

type DatePickerProps = {
  label?: string;
  value?: number;
  required?: boolean;
  error?: string;
  onChange?: (value: number | undefined) => void;
};

export const DatePicker = (props: DatePickerProps) => {
  const { label, value, required, error, onChange } = props;
  const today = dayjs().format("YYYY-MM-DD");

  const [date, setDate] = useState<number>(Date.now());

  useEffect(() => {
    setDate(value || Date.now());
  }, [value]);

  return (
    <div className={styles.datepicker_container}>
      <div className={styles.datepicker_label_container}>
        {label && (
          <div className={styles.datepicker_label}>
            {label}
            {required && <span className="kl-text-input-required"> *</span>}
          </div>
        )}
      </div>
      <div className={styles.datepicker_wrapper}>
        <input
          type="date"
          min={today}
          value={dayjs(value || date).format("YYYY-MM-DD")}
          className={classNames({
            [styles.datepicker_input]: true,
            [styles.datepicker_error]: Boolean(error),
          })}
          onChange={(evt) => {
            const date = evt.target.value;
            setDate(dayjs(date).startOf("day").valueOf());
            onChange?.(date ? dayjs(date).startOf("day").valueOf() : undefined);
          }}
        />
      </div>
      <div className="kl-text-input-bottom">
        {error && (
          <div className={styles.error_text} data-cy="errortext">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
