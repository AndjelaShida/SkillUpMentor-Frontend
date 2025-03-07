import CreateUpdateRoleForm from 'components/Role/CreateUpdateRoleForm/CreateUpdateRoleForm'
import DashbordLayout from 'components/ui/DashbordLayout'
import { FC } from 'react'

const DashbordRolesAdd: FC = () => {
  return (
    <DashbordLayout>
      <h1 className="mb-4 text-center">Create new role</h1>
      <CreateUpdateRoleForm></CreateUpdateRoleForm>
    </DashbordLayout>
  )
}

export default DashbordRolesAdd
