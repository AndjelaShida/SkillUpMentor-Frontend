import DashbordLayout from 'components/ui/DashbordLayout'
import { FC, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import useMediaQuery from 'hooks/useMediaQuery'
import { useQuery, useMutation } from 'react-query'
import * as API from 'api/Api'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routesConstants'
import { StatusCode } from 'constants/errorConstants'
import { ProductType } from 'models/products'

const DashbordProducts: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const { isMobile } = useMediaQuery(768)
  const [pageNumber, setPageNumber] = useState(1)

  const { data, isLoading, refetch } = useQuery(
    ['fetchProduct', pageNumber],
    () => API.fetchProducts(pageNumber),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const { mutate } = useMutation((id: string) => API.deleteProducts(id), {
    onSuccess: (response) => {
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (
        response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(response.data.message)
        setShowError(true)
      } else {
        refetch()
      }
    },
    onError: () => {
      setApiError('Something went wrong while deleting a product')
      setShowError(true)
    },
  })

  const handleDelete = (id: string) => {
    mutate(id)
  }

  // Add a fallback for API URL
  const apiUrl = process.env.REACT_APP_API_URL

  return (
    <DashbordLayout>
      <div className="mb-4">
        <h1 className="mb-5">Products</h1>
        <Link
          className="btn btn-dark"
          to={`${routes.DASHBOARD_PREFIX}/products/add`}
        >
          Add
        </Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.data.data.length === 0 ? (
            <p>No products found</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.data.map((item: ProductType, index: number) => (
                    <tr key={index}>
                      <td>
                        <img
                          width={100}
                          src={
                            apiUrl
                              ? `${apiUrl}/files/${item.image}`
                              : '/default-image.jpg'
                          }
                          alt={item.title}
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.price}</td>
                      <td>
                        <Link
                          className={
                            isMobile
                              ? 'btn btn-warning btn-sm me-2 mb-2'
                              : 'btn btn-warning me-2'
                          }
                          to={`${routes.DASHBOARD_PREFIX}/products/edit`}
                          state={{ ...item }}
                        >
                          Edit
                        </Link>
                        <Button
                          className={
                            isMobile ? 'btn-danger mb-2' : 'btn btn-danger'
                          }
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination buttons */}
              {data?.data.meta?.last_page && data.data.meta.last_page > 1 && (
                <div className="text-center mt-3">
                  <Button
                    className="me-2"
                    onClick={() => setPageNumber((prev) => prev - 1)}
                    disabled={pageNumber === 1}
                  >
                    Prev page
                  </Button>
                  <Button
                    onClick={() => setPageNumber((prev) => prev + 1)}
                    disabled={pageNumber >= (data?.data.meta.last_page ?? 1)}
                  >
                    Next page
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showError && (
        <ToastContainer key="error-toast" className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError} autohide>
            <Toast.Header>
              <strong className="me-auto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </DashbordLayout>
  )
}

export default DashbordProducts
