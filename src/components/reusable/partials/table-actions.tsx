import { Eye, SquarePen } from "lucide-react";
import { Link } from "react-router-dom"
import DeleteModal from "./delete-modal";


interface TableActionsProps {
    viewDetailPath: string;
    editPath: string;
    deleteHeading: string;
    deleteSubheading: string;
    deleteTooltip: string;
    onDelete: () => void;
}


const TableActions = (params: TableActionsProps) => {
  return (
      <div className="flex items-center gap-3">
        <Link
          to={params.viewDetailPath}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Link>
        <Link
          to={params.editPath}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <SquarePen className="h-4 w-4" />
        </Link>
        <DeleteModal 
            heading={params.deleteHeading}
            subheading={params.deleteSubheading}
            tooltipText={params.deleteTooltip}
            onDelete={params.onDelete}
        />
      </div>
  )
}

export default TableActions;
