import Axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { CreateUpdateProductFields } from '../hooks/useCreateUpdateProduct'

/**
 * General API request function.
 * @param method HTTP method (e.g., 'get', 'post', etc.).
 * @param path API endpoint path.
 * @param input Request body data.
 * @param options Additional Axios configuration options.
 * @returns API response or error response.
 */
export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  input?: D,
  options?: {
    headers?: AxiosRequestHeaders
  } & AxiosRequestConfig,
) {
  try {
    const response = await Axios.request<R>({
      baseURL: process.env.REACT_APP_API_URL, // Ensure this is set in your .env file
      url: path,
      method: method,
      data: input,
      headers: options?.headers,
      withCredentials: true, // Ensures cookies are sent with the request
    })
    return response
  } catch (error: any) {
    return error.response // Returns error response for better handling
  }
}

export * from './User'
export * from './Role'
export * from './Product'
export * from './Order'

export function uploadAvatar(formData: FormData, id: string) {
  return apiRequest<
    FormData,
    { data: { id: string; statusCode: number; message?: string } }
  >('post', `/users/${id}/avatar`, formData)
}

export function fetchCurrentUser() {
  return apiRequest<
    void,
    { data: { id: string; name: string; email: string } }
  >('get', '/users/me')
}

export function updateProduct(data: CreateUpdateProductFields, id: string) {
  return apiRequest<CreateUpdateProductFields, { data: any }>(
    'put',
    `/products/${id}`,
    data,
  )
}
