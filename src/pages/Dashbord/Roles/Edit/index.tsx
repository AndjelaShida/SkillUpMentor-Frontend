import CreateUpdateRoleForm from 'components/Role/CreateUpdateRoleForm/CreateUpdateRoleForm'
import DashbordLayout from 'components/ui/DashbordLayout'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const DashbordRolesEdit: FC = () => {
  const location = useLocation()
  return (
    <DashbordLayout>
      <h1 className="mb-4 text-center">Edit role</h1>
      <CreateUpdateRoleForm
        defaultValues={location.state}
      ></CreateUpdateRoleForm>
    </DashbordLayout>
  )
}

export default DashbordRolesEdit
