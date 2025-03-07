import { FC, ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface Props {
  children: ReactNode | ReactNode[]
}

const DashbordLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <Topbar />
      </div>
      <div className="p-4">{children}</div>
    </>
  )
}

export default DashbordLayout
