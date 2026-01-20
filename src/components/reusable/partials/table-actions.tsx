import { Eye, SquarePen } from "lucide-react";
import { Link } from "react-router-dom"
import DeleteModal from "./delete-modal";


interface TableActionsProps {
    viewDetailPath?: string;
    editPath?: string;
    deleteHeading?: string;
    deleteSubheading?: string;
    deleteTooltip?: string;
    onDelete?: () => void;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}


const TableActions = (params: TableActionsProps) => {
  const {
    viewDetailPath,
    editPath,
    deleteHeading,
    deleteSubheading,
    deleteTooltip,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true,
  } = params;

  return (
      <div className="flex items-center gap-3">
        {showView && viewDetailPath && (
          <Link
            to={viewDetailPath}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Link>
        )}
        {showEdit && editPath && (
          <Link
            to={editPath}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SquarePen className="h-4 w-4" />
          </Link>
        )}
        {showDelete && deleteHeading && deleteSubheading && deleteTooltip && onDelete && (
          <DeleteModal
              heading={deleteHeading}
              subheading={deleteSubheading}
              tooltipText={deleteTooltip}
              onDelete={onDelete}
          />
        )}
      </div>
  )
}

export default TableActions;
