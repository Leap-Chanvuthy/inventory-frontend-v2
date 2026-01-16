import { useUserStatistic } from "@/api/users/user.query"
import { StatCard } from "@/components/reusable/charts/stat-card"

const UserStat = () => {

  const {data , isPending } = useUserStatistic();


  return (
    <section className="p-4 mx-2">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
        <StatCard
            title="Total Users Trend"
            value={data ? data.total_users.toString() : "0"}
            pillValue={data ? `${data.total_users_trend.percent}%` : "0%"}
            trend={data && data.total_users_trend.direction === "up" ? "up" : "down"}
            trendLabel="Since last month"
            description="Number of active users in the system."
            isPeinding={isPending}
          />
          <StatCard
            title="Total Users"
            value="36"
            pillValue="+12%"
            trend="down"
            trendLabel="Since last month"
            description="Number of active users in the system."
          />
          <StatCard
            title="Total Users"
            value="36"
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
