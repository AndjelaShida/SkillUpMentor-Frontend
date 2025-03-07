import { apiRoutes } from 'constants/apiConstants'
import { CreateUpdateProductFields } from 'hooks/useCreateUpdateProduct'
import { ProductType } from 'models/products'
import { apiRequest } from './Api'

export const fetchProducts = async (pageNumber: number) =>
  apiRequest<undefined, ProductType[]>(
    'get',
    `${apiRoutes.PRODUCTS_PREFIX}?page=${pageNumber}`,
  )

export const createProduct = async (data: CreateUpdateProductFields) =>
  apiRequest<CreateUpdateProductFields, ProductType>(
    'post',
    apiRoutes.PRODUCTS_PREFIX,
    data,
  )

export const uploadProductImage = async (formData: FormData, id: string) =>
  apiRequest<FormData, { data: { url: string } }>(
    'post',
    `${apiRoutes.UPLOAD_PRODUCT_IMAGE}/${id}`,
    formData,
  )

export const uploadProduct = async (
  data: CreateUpdateProductFields,
  id: string,
) =>
  apiRequest<CreateUpdateProductFields, ProductType>(
    'patch',
    `${apiRoutes.PRODUCTS_PREFIX}/${id}`,
    data,
  )

export const deleteProducts = async (id: string) =>
  apiRequest<string, ProductType>(
    'delete',
    `${apiRoutes.PRODUCTS_PREFIX}/${id}`,
  )
