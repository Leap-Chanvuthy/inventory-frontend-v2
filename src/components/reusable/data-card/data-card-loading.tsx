import { Spinner } from "@/components/ui/spinner";

interface DataCardLoadingProps {
  text?: string;
  className?: string;
}

export default function DataCardLoading({ text, className }: DataCardLoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className ?? "min-h-[calc(100vh-200px)]"}`}>
      <Spinner className="size-8" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
