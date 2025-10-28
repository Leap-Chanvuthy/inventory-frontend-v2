import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet } from "react-router-dom";
import Header from "./header";
import { ThemeProvider } from "./theme/theme-provider";

export default function Layout() {
  return (
    <ThemeProvider>
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-5 overflow-y-auto bg-background dark:bg-background-dark">
          {/* 👇 Nested route content will be injected here */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
}
