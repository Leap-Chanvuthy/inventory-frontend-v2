import { Spinner } from "@/components/ui/spinner";

export default function DataCardLoading() {
  return (
    <div className="flex justify-center py-20">
      <Spinner className="size-8" />
    </div>
  );
}
