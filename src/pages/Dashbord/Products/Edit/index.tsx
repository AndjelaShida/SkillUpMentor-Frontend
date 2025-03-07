import CreateUpdateProductForm from 'components/Product/CreateUpdateProductFrom/CreateUpdateProductForm'
import DashbordLayout from 'components/ui/DashbordLayout'
import { FC } from 'react'
import { useLocation } from 'react-router-dom'

const DashbordProductEdit: FC = () => {
  const location = useLocation()
  return (
    <DashbordLayout>
      <h1 className="mb-4 text-center">Edit new product</h1>
      <CreateUpdateProductForm defaultValues={location.state} />
    </DashbordLayout>
  )
}

export default DashbordProductEdit
