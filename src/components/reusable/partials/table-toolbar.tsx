import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  ArrowUpDown,
  Filter,
  Download,
} from "lucide-react"
import { Link } from "react-router-dom"

export const TableToolbar = ({
  onSearch,
  onCreate,
  href,
}: {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCreate: () => void
  href: string
}) => (
  <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
    <div className="flex flex-1 flex-col sm:flex-row gap-3">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          onChange={onSearch}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>

    <Link to={href}>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
    </Link>
  </div>
)