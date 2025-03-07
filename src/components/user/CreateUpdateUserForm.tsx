import {
  CreateUserFields,
  UpdateUserFields,
  useCreateUpdateUserForm,
} from 'hooks/react-hook-form/useCreateUpdateUser'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from 'constants/routesConstants'
import Button from 'react-bootstrap/Button'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import authStore from 'stores/auth.store'
import Avatar from 'react-avatar'
import { observer } from 'mobx-react'
import { UserType } from 'models/auth'
import { RoleType } from 'models/role'

interface Props {
  defaultValues?: UserType & { isActiveUser?: boolean }
}

const CreateUpdateUserForm: FC<Props> = ({ defaultValues }) => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useCreateUpdateUserForm({
    defaultValues,
  })
  const { data: rolesData } = useQuery(['roles'], API.fetchRoles)
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(
    async (data: CreateUserFields | UpdateUserFields) => {
      if (!defaultValues) {
        await handleAdd(data as CreateUserFields)
      } else {
        await handleUpdate(data as UpdateUserFields)
      }
    },
  )

  // **Handles User Creation**
  const handleAdd = async (data: CreateUserFields) => {
    if (!file) {
      setFileError(true)
      return
    }

    try {
      const response = await API.createUser(data)
      if (!response || !response.data)
        throw new Error('Invalid response from API')

      if (
        [StatusCode.BAD_REQUEST, StatusCode.INTERNAL_SERVER_ERROR].includes(
          response.data?.statusCode,
        )
      ) {
        throw new Error(response.data.message)
      }

      // Upload avatar
      const formData = new FormData()
      formData.append('avatar', file, file.name)
      const fileResponse = await API.uploadAavatar(formData, response.data.id)

      if (
        [StatusCode.BAD_REQUEST, StatusCode.INTERNAL_SERVER_ERROR].includes(
          fileResponse.data?.statusCode,
        )
      ) {
        throw new Error(fileResponse.data.message)
      }

      navigate(`${routes.DASHBOARD_PREFIX}/users`)
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      )
      setShowError(true)
    }
  }

  // **Handles User Update**
  const handleUpdate = async (data: UpdateUserFields) => {
    try {
      const response = await API.updateUser(data, defaultValues?.id as string)
      if (!response || !response.data)
        throw new Error('Invalid response from API')

      if (
        [StatusCode.BAD_REQUEST, StatusCode.INTERNAL_SERVER_ERROR].includes(
          response.data?.statusCode,
        )
      ) {
        throw new Error(response.data.message)
      }

      if (!file) {
        if (defaultValues?.isActiveUser) {
          authStore.login(response.data)
        }
        navigate(`${routes.DASHBOARD_PREFIX}/users`)
        return
      }

      // Upload avatar
      const formData = new FormData()
      formData.append('avatar', file, file.name)
      const fileResponse = await API.uploadAvatar(formData, response.data.id)

      if (
        [StatusCode.BAD_REQUEST, StatusCode.INTERNAL_SERVER_ERROR].includes(
          fileResponse.data?.statusCode,
        )
      ) {
        throw new Error(fileResponse.data.message)
      }

      if (defaultValues?.isActiveUser) {
        const userResponse = await API.fetchCurrentUser()
        if (!userResponse || !userResponse.data)
          throw new Error('Failed to fetch updated user')

        authStore.login(userResponse.data)
      }

      navigate(`${routes.DASHBOARD_PREFIX}/users`)
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      )
      setShowError(true)
    }
  }

  // **Handles File Change**
  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      setFile(target.files[0])
    }
  }

  // **Preview Image Effect**
  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFileError(false)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <>
      <Form className="user-form" onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <FormLabel htmlFor="avatar">
            <Avatar
              round
              src={
                preview ||
                (defaultValues
                  ? `${process.env.REACT_APP_API_URL}/files/${defaultValues?.avatar}`
                  : undefined)
              }
              alt="Avatar"
            />
          </FormLabel>
          <input
            onChange={handleFileChange}
            id="avatar"
            name="avatar"
            type="file"
            className="d-none"
          />
          {fileError && (
            <div className="invalid-feedback text-danger">
              Field avatar is required
            </div>
          )}
        </Form.Group>

        {/* FIRST NAME */}
        <Controller
          control={control}
          name="first_name"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <input
                {...field}
                type="text"
                className={
                  errors.first_name ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.first_name && (
                <div className="invalid-feedback text-danger">
                  {errors.first_name.message}
                </div>
              )}
            </Form.Group>
          )}
        />

        {/* ROLE SELECTION */}
        <Controller
          control={control}
          name="role_id"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="role_id">Role</FormLabel>
              <Form.Select
                {...field}
                className={
                  errors.role ? 'form-control is-invalid' : 'form-control'
                }
              >
                <option value="">Select Role</option>
                {rolesData?.map((role: RoleType) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Select>
              {errors.role && (
                <div className="invalid-feedback text-danger">
                  {errors.role.message}
                </div>
              )}
            </Form.Group>
          )}
        />

        <Button className="w-100" type="submit">
          {defaultValues ? 'Update User' : 'Create New User'}
        </Button>
      </Form>

      {showError && (
        <ToastContainer position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError} autohide>
            <Toast.Header>
              <strong className="me-auto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default observer(CreateUpdateUserForm)
