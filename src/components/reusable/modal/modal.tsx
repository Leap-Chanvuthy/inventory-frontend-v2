import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types ---
interface RawMaterial {
  id: string;
  name: string;
  code: string;
  category: string;
  status: 'Low Stock' | 'Out of Stock' | 'In Stock';
  quantity: number;
  unit: string;
}

const data: RawMaterial[] = [
  { id: '1', name: 'Silicon Wafer', code: 'S-W-002', category: 'Semiconductor', status: 'Low Stock', quantity: 50, unit: 'pieces' },
  { id: '2', name: 'Polypropylene Pellets', code: 'P-P-005', category: 'Plastic', status: 'Out of Stock', quantity: 0, unit: 'kg' },
  { id: '3', name: 'Capacitor 10uF', code: 'C-10UF-006', category: 'Electronic', status: 'Low Stock', quantity: 120, unit: 'mm' },
  { id: '4', name: 'Water Melon Juice', code: 'C-10UF-007', category: 'Electronic', status: 'Low Stock', quantity: 10, unit: 'kg' },
];


interface ModalProps {
  open : boolean;
  onOpenChange: (open: boolean) => void;
  modalHeader?: string;
  modalDescription?: string;
  tableHeader?: string[];
  // table
}


export function DataModal({props } : { props : ModalProps }) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] md:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{props.modalHeader || 'Select Your Items'}</DialogTitle>
          <DialogDescription>
            {props.modalDescription || 'Select your items from the list below.'}
          </DialogDescription>
        </DialogHeader>

        {/* --- Toolbar --- */}
        <div className="flex flex-col md:flex-row gap-4 my-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search raw materials..." className="pl-9" />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
            </Button>
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button className="bg-[#5e35b1] hover:bg-[#4527a0] text-white flex-1 md:flex-none">
              <Plus className="mr-2 h-4 w-4" /> Select This Material
            </Button>
          </div>
        </div>

        {/* --- Responsive Table Container --- */}
        <div className="grid grid-cols-1 rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                {props.tableHeader?.map((header, index) => (
                  <TableHead key={index} >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox defaultChecked={item.status !== 'In Stock'} />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{item.code}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        item.status === 'Out of Stock' 
                        ? "bg-red-50 text-red-600 border-red-100" 
                        : "bg-orange-50 text-orange-600 border-orange-100"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* --- Pagination --- */}
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" className="h-8 w-8 bg-[#5e35b1]">1</Button>
          <Button variant="ghost" size="sm" className="h-8 w-8">2</Button>
          <Button variant="ghost" size="sm" className="h-8 w-8">3</Button>
          <span className="text-muted-foreground">...</span>
          <Button variant="ghost" size="sm" className="h-8 w-8">10</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}