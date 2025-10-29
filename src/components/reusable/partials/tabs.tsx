import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReusableTabsProps } from "@/config/types/company-tab-item"

const ReusableTabs: React.FC<ReusableTabsProps> = ({ tabs, defaultValue }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get("tabs") || defaultValue || tabs[0].value

  useEffect(() => {
    if (!searchParams.get("tabs")) {
      setSearchParams({ tabs: currentTab })
    }
  }, [])

  const handleTabChange = (value: string) => {
    setSearchParams({ tabs: value })
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex w-full bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-black rounded-md"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-3">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default ReusableTabs
