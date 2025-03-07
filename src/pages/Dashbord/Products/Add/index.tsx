import CreateUpdateProductForm from 'components/Product/CreateUpdateProductFrom/CreateUpdateProductForm'
import DashbordLayout from 'components/ui/DashbordLayout'
import { FC } from 'react'

const DashbordProductsAdd: FC = () => {
  return (
    <DashbordLayout>
      <h1 className="mb-4 text-center">Create new product</h1>
      <CreateUpdateProductForm />
    </DashbordLayout>
  )
}

export default DashbordProductsAdd
