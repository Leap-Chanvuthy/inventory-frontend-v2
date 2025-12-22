import { StatCard } from "@/components/reusable/charts/stat-card"

const UserStat = () => {
  return (
    <section className="p-4 mx-2">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
        <StatCard
            title="Total Users"
            value="1,234"
            pillValue="+12%"
            trend="up"
            trendLabel="Since last month"
            description="Number of active users in the system."
          />
              <StatCard
            title="Total Users"
            value="1,234"
            pillValue="+12%"
            trend="up"
            trendLabel="Since last month"
            description="Number of active users in the system."
          />
              <StatCard
            title="Total Users"
            value="1,234"
            pillValue="+12%"
            trend="up"
            trendLabel="Since last month"
            description="Number of active users in the system."
          />
    </div>
    </section>
  )
}

export default UserStat
