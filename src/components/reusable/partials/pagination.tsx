import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function GlobalPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}



// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"

// type LaravelPaginationMeta = {
//   current_page: number
//   last_page: number
//   per_page: number
//   total: number
// }

// interface GlobalPaginationProps {
//   meta: LaravelPaginationMeta
//   onPageChange: (page: number) => void
// }

// export const GlobalPagination = ({ meta, onPageChange }: GlobalPaginationProps) => {
//   const { current_page, last_page } = meta

//   if (last_page <= 1) return null

//   const getPages = () => {
//     const pages: (number | "ellipsis")[] = []

//     for (let i = 1; i <= last_page; i++) {
//       if (
//         i === 1 ||
//         i === last_page ||
//         (i >= current_page - 1 && i <= current_page + 1)
//       ) {
//         pages.push(i)
//       } else if (
//         i === current_page - 2 ||
//         i === current_page + 2
//       ) {
//         pages.push("ellipsis")
//       }
//     }

//     return pages.filter(
//       (item, index, arr) => item !== "ellipsis" || arr[index - 1] !== "ellipsis"
//     )
//   }

//   return (
//     <Pagination>
//       <PaginationContent>
//         {/* Previous */}
//         <PaginationItem>
//           <PaginationPrevious
//             onClick={() => onPageChange(current_page - 1)}
//             aria-disabled={current_page === 1}
//             className={current_page === 1 ? "pointer-events-none opacity-50" : ""}
//           />
//         </PaginationItem>

//         {/* Page Numbers */}
//         {getPages().map((page, index) => (
//           <PaginationItem key={index}>
//             {page === "ellipsis" ? (
//               <PaginationEllipsis />
//             ) : (
//               <PaginationLink
//                 isActive={page === current_page}
//                 onClick={() => onPageChange(page)}
//               >
//                 {page}
//               </PaginationLink>
//             )}
//           </PaginationItem>
//         ))}

//         {/* Next */}
//         <PaginationItem>
//           <PaginationNext
//             onClick={() => onPageChange(current_page + 1)}
//             aria-disabled={current_page === last_page}
//             className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
//           />
//         </PaginationItem>
//       </PaginationContent>
//     </Pagination>
//   )
// }
