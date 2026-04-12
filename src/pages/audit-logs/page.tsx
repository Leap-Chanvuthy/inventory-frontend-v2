import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import AuditLogList from "./_components/audit-log-list";
import AuditLogStat from "./_components/audit-log-stat";

const AuditLog = () => {
  const breadcrumbItems = [
    { name: "applications", label: "Applications", link: "/applications" },
    { name: "audit-logs", label: "Audit Logs", link: "/audit-logs" },
    { name: "list", label: "List of logs" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6 mb-6">Audit Logs</Text.TitleLarge>
      <AuditLogStat />
      <AuditLogList />
    </div>
  );
};

export default AuditLog;
