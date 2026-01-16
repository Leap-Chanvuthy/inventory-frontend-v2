import React, { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TabItem {
  label: string;
  value: string;
  content: React.ReactNode;
  badge?: number | string;
}

interface UnderlineTabsProps {
  name: string;
  tabs: TabItem[];
  defaultValue?: string;
}

const UnderlineTabs: React.FC<UnderlineTabsProps> = ({
  tabs,
  defaultValue,
  name,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = useMemo(() => {
    return searchParams.get("tab") || defaultValue || tabs[0]?.value;
  }, [searchParams, defaultValue]);

  useEffect(() => {
    if (!searchParams.get("tab") && tabs.length > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("tab", defaultValue || tabs[0]?.value);
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams, defaultValue, tabs]);

  const handleTabChange = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(searchParams);

      // Clear table-related params when switching tabs
      newParams.delete("search");
      newParams.delete("page");
      newParams.delete("per_page");
      newParams.delete("sort");
      newParams.delete("filter");

      newParams.set("tab", value);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className="w-full" id={name}>
      {/* Tab Headers */}
      <div className="flex w-full border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`
              relative px-6 py-3 text-sm font-medium transition-colors
              flex flex-1 items-center justify-center gap-2
              ${
                currentTab === tab.value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
            id={`${name}-${tab.value}`}
            aria-label={`${tab.label} tab`}
          >
            <span>{tab.label}</span>

            {/* Badge */}
            {tab.badge !== undefined && (
              <Badge
                variant={currentTab === tab.value ? "default" : "secondary"}
                className={`
                  ml-1 rounded-full
                  ${
                    currentTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }
                `}
              >
                {tab.badge}
              </Badge>
            )}

            {/* Underline indicator */}
            {currentTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={currentTab === tab.value ? "block" : "hidden"}
            role="tabpanel"
            id={`${name}-${tab.value}-content`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnderlineTabs;
