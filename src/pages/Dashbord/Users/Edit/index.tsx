import DashbordLayout from 'components/ui/DashbordLayout'
import CreateUpdateUserForm from 'components/user/CreateUpdateUserForm'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const DashbordUsersEdit: FC = () => {
  const location = useLocation()
  return (
    <DashbordLayout>
      <h1 className="mb-4 text-center">Edit user</h1>
      <CreateUpdateUserForm defaultValues={location.state} />
    </DashbordLayout>
  )
}

export default DashbordUsersEdit
