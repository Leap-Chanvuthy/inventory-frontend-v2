export default function DataCardEmpty({ emptyText }: { emptyText?: string }) {
  return (
    <p className="text-center py-10 text-muted-foreground">
      {emptyText || "No data found"}
    </p>
  );
}
