import DataCardLoading from "./data-card-loading";
import DataCardEmpty from "./data-card-empty";

type Props<T> = {
  data?: T[];
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  renderItem: (item: T) => React.ReactNode;
};

export function DataCard<T>({
  data,
  isLoading,
  loadingText,
  emptyText,
  renderItem,
}: Props<T>) {
  if (isLoading) {
    return <DataCardLoading text={loadingText} />;
  }

  if (!data?.length) {
    return <DataCardEmpty emptyText={emptyText} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
      {data.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
