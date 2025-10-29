export interface TabItem {
  label: string
  value: string
  content: React.ReactNode
}

export interface ReusableTabsProps {
  name: string
  tabs: TabItem[]
  defaultValue?: string
}
