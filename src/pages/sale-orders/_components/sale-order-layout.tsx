import type { ReactNode } from "react";

interface SaleOrderLayoutProps {
  header: ReactNode;
  filters?: ReactNode;
  subTabs?: ReactNode;
  list: ReactNode;
  pagination?: ReactNode;
  detail: ReactNode;
}

export function SaleOrderLayout({
  header,
  filters,
  subTabs,
  list,
  pagination,
  detail,
}: SaleOrderLayoutProps) {
  return (
    <div className="h-full min-h-0">
      <div className="flex h-[calc(100vh-128px)] min-h-[700px] flex-col overflow-hidden rounded-xl border border-border bg-card/50 lg:flex-row">
        <aside className="flex w-full min-h-[360px] flex-col border-b border-border bg-card lg:min-h-0 lg:w-[47%] lg:max-w-[600px] lg:border-b-0 lg:border-r xl:w-[44%] xl:max-w-[660px]">
          <div className="flex h-16 items-center border-b border-border bg-card px-4">{header}</div>

          {filters && <div className="border-b border-border bg-muted/30 px-4 py-3">{filters}</div>}

          {subTabs && <div className="border-b border-border bg-card px-3 py-2">{subTabs}</div>}

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden">{list}</div>
            {pagination && <div className="border-t border-border bg-card px-3 py-2">{pagination}</div>}
          </div>
        </aside>

        <main className="flex min-h-[420px] flex-1 flex-col overflow-hidden bg-background">{detail}</main>
      </div>
    </div>
  );
}
