// import { Link, useLocation } from "react-router-dom";
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
// } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";
// import { SidebarGroup as SidebarGroupType } from '../../consts/sidebar';

// interface Props {
//   group: SidebarGroupType;
// }

// export function SidebarMenuGroup({ group }: Props) {
//   const location = useLocation();

//   return (
//     <SidebarGroup>
//       {group.label && (
//         <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
//       )}

//       <SidebarGroupContent>
//         <SidebarMenu>
//           {group.items.map((item) => {
//             const isActive =
//               location.pathname === item.url ||
//               location.pathname.startsWith(item.url + "/");

//             return (
//               <SidebarMenuItem key={item.title}>
//                 <SidebarMenuButton asChild>
//                   <Link
//                     to={item.url}
//                     className={cn(
//                       "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
//                       "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
//                       isActive
//                         ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
//                         : "text-[hsl(var(--muted-foreground))]"
//                     )}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     <span>{item.title}</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             );
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }



import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarGroup as SidebarGroupType } from '../../consts/sidebar';

interface Props {
  group: SidebarGroupType;
}

export function SidebarMenuGroup({ group }: Props) {
  const location = useLocation();

  return (
    <SidebarGroup>
      {group.label && (
        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      )}

      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => {
            const isLocked = !!item.isLocked;
            const isActive =
              !isLocked &&
              (location.pathname === item.url ||
                location.pathname.startsWith(item.url + "/"));

            const baseClass =
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all";

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  {isLocked ? (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Coming soon"
                      className={cn(
                        baseClass,
                        "text-[hsl(var(--muted-foreground))] opacity-60 cursor-not-allowed"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.url}
                      className={cn(
                        baseClass,
                        "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                        isActive
                          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                          : "text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
