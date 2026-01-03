import { useUsers } from '@/api/users/user.query';
import { User } from '@/api/users/user.types';
import { ApiSearchSelect } from '@/components/reusable/api-search-select/api-search-select';
import { useSearchSelectParams } from '@/hooks/use-search-select-params';
import { useState } from 'react'

const UserSearchSelect = () => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const { search, setPage , setSearch, apiParams } = useSearchSelectParams();

    const { data, isLoading } = useUsers({
        ...apiParams,
    });


    return (

        // user-search-select.tsx (where you use ApiSearchSelect)
        <ApiSearchSelect<User>
            mode="multiple"
            data={data?.data}
            isLoading={isLoading}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder='Select User...'
            selected={selectedUsers}
            onChange={setSelectedUsers}
            getId={user => user.id}
            getLabels={user => [user.name, user.email, user.role]}
            currentPage={data?.current_page}
            lastPage={data?.last_page}
            onPageChange={setPage}
        />

    )
}

export default UserSearchSelect
