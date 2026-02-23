import { Text } from "@/components/ui/text/app-text";
import QuickMenuDashboard from "./_components/quick-menu-dashboard";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {

  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Text.Large>Hi {user?.name}, Welcome Back.</Text.Large>

      <QuickMenuDashboard />
    </div>
  );
};

export default Home;
