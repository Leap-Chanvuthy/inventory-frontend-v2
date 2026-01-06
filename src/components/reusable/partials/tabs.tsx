import React, { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface ReusableTabsProps {
  name: string;
  tabs: TabItem[];
  defaultValue?: string;
}

const ReusableTabs: React.FC<ReusableTabsProps> = ({
  tabs,
  defaultValue,
  name,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = useMemo(() => {
    return searchParams.get("tab") || defaultValue || tabs[0]?.value;
  }, [searchParams, defaultValue, tabs]);

  useEffect(() => {
    if (!searchParams.get("tab")) {
      const params = new URLSearchParams(searchParams);
      params.set("tab", defaultValue || tabs[0]?.value);
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams, defaultValue, tabs]);

  const handleTabChange = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("tab", value);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="w-full"
      id={name}
    >
      <TabsList
        className="flex w-full bg-muted p-1 rounded-lg"
        aria-label={name}
      >
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            id={`${name}-${tab.value}`}
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:text-black rounded-md"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-3">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ReusableTabs;
