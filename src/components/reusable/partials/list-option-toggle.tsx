import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { LayoutGrid, Table } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { setOption } from "@/redux/slices/list-options-slice";

type ListOption = "table" | "card";

const ListOptionToggle = () => {
  const dispatch = useDispatch();
  const option =
    useSelector((state: RootState) => state.listOptions.option) ?? "table";

  const nextOption: ListOption = option === "table" ? "card" : "table";
  const NextIcon = option === "table" ? LayoutGrid : Table;

  const tooltipLabel =
    nextOption === "card" ? "Switch to card view" : "Switch to table view";

  return (
    <TooltipProvider delayDuration={200}>
      <ToggleGroup type="single" value={option}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value={option}
              aria-label={tooltipLabel}
              onClick={() => dispatch(setOption(nextOption))}
            >
              <NextIcon className="h-4 w-4 rounded-sm" />
            </ToggleGroupItem>
          </TooltipTrigger>

          <TooltipContent side="bottom" align="center">
            {tooltipLabel}
          </TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  );
};

export default ListOptionToggle;
