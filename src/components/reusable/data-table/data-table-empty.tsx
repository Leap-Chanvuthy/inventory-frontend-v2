const DataTableEmpty = ({emptyText}: {emptyText?: string}) => {
  return (
    <p className="text-center py-6">{emptyText || 'No data available.'}</p>
  )
}

export default DataTableEmpty
