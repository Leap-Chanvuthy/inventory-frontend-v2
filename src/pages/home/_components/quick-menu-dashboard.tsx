import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { quickMenu, type SidebarItem } from "@/consts/sidebar";

interface QuickMenuDashboardProps {
  title?: string;
  description?: string;
  actions?: SidebarItem[];
}

const QuickMenuDashboard = ({
  title = "Quick Actions",
  description = "Fast access to commonly used features",
  actions = quickMenu,
}: QuickMenuDashboardProps) => {
  const { canAny } = useAuth();

  const visibleActions = actions.filter(
    (action)=>
      !action.permissions ||
      action.permissions.length === 0 ||
      canAny(action.permissions),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleActions.map(action => {
            const Icon = action.icon;
            const isLocked = !!action.isLocked;

            return (
              <Button
                key={action.url}
                variant="outline"
                asChild
                disabled={isLocked}
                className="h-auto justify-start p-4 text-left"
              >
                <Link to={isLocked ? "#" : action.url} aria-disabled={isLocked}>
                  <div className="flex items-start gap-3 w-full overflow-hidden">
                    <div className="rounded-md border border-primary p-2">
                      <Icon className="h-4 w-4 text-primary"/>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-none truncate">
                        {action.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {isLocked
                          ? "Coming soon"
                          : `Open ${action.title.toLowerCase()}`}
                      </p>
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickMenuDashboard;
