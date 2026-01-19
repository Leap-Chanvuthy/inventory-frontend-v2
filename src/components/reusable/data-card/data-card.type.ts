import { ReactNode } from "react";

export type DataCardItem<T> = {
  key: string;
  render: (item: T) => ReactNode;
};
