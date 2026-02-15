import dayjs from "dayjs";

export const classNames = (
  classes: Record<string, boolean>,
): string | undefined => {
  const currentClasses: Array<string> = [];

  Object.entries(classes).forEach(([key, value]) => {
    if (value) {
      currentClasses.push(key);
    }
  });

  if (currentClasses.length) {
    return currentClasses.join(" ");
  } else {
    return undefined;
  }
};

export const LOCAL_STORAGE = {
  set: <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  get: <T>(key: string): T | null => {
    const stringifiedData = localStorage.getItem(key);
    if (stringifiedData) {
      return JSON.parse(stringifiedData);
    } else {
      return null;
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
};

export function getTitle(value: string): string {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ") // in_progress → in progress
    .replace(/\s+/g, " ") // normalize spaces
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const getTimeFormat = (value: number, format = "DD MMM YYYY") => {
  return dayjs(value).format(format);
};
