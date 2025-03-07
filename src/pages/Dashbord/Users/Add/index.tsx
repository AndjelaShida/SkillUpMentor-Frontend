import DashbordLayout from 'components/ui/DashbordLayout'
import { FC } from 'react'
import CreateUpdateUserForm from 'components/user/CreateUpdateUserForm'

const DashbordUsersAdd: FC = () => {
  return (
    <DashbordLayout>
      <h1 className="mb-4 text-center">Create new user</h1>
      <CreateUpdateUserForm />
    </DashbordLayout>
  )
}

export default DashbordUsersAdd
