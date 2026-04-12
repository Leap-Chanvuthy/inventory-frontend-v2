import { useParams } from "react-router-dom";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import AuditLogMeta from "./_components/audit-log-meta";
import AuditLogDetail from "./_components/audit-log-detail";
import { useAuditById } from "@/api/audit-log/audit-log.query";
import UnexpectedError from "@/components/reusable/partials/error";

const ViewAuditLog = () => {
  const { id } = useParams<{ id: string }>();
  const idNum = Number(id);

  const { data, isLoading, isError } = useAuditById(idNum);

  const audit = data?.data;

  const breadcrumbItems = [
    { name: "applications", label: "Applications", link: "/applications" },
    { name: "audit-logs", label: "Audit Logs", link: "/audit-logs" },
    { name: "detail", label: "Audit Detail" },
  ];

  if (isError) return <UnexpectedError kind="fetch" />;

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <Text.TitleLarge className="mx-6 mb-6">Audit Log Detail</Text.TitleLarge>

      <div className="mx-6 mb-6">
        {isLoading ? (
          <div className="p-6 bg-muted rounded-lg">Loading...</div>
        ) : (
          <>
            <AuditLogMeta audit={audit} />
            <AuditLogDetail audit={audit} />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAuditLog;
