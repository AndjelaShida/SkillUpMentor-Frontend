import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType
}

/* Public routes */
const Home = lazy(() => import('pages/Home'))

/* Private routes */
const Dashboard = lazy(() => import('pages/Dashbord'))
const DashbordUsers = lazy(() => import('pages/Dashbord/Users'))
const DashbordUsersAdd = lazy(() => import('pages/Dashbord/Users/Add'))
const DashbordUsersEdit = lazy(() => import('pages/Dashbord/Users/Edit'))
const DashbordRoles = lazy(() => import('pages/Dashbord/Roles'))
const DashbordRolesAdd = lazy(() => import('pages/Dashbord/Roles/Edit'))
const DashbordRolesEdit = lazy(() => import('pages/Dashbord/Roles/Edit'))
const DashbordProducts = lazy(() => import('pages/Dashbord/Roles/Add'))
const DashbordProductsAdd = lazy(() => import('pages/Dashbord/Products/Add'))
const DashbordProductsEdit = lazy(() => import('pages/Dashbord/Products/Edit'))

//const DashbordOrders = lazy (() => import('pages/Dashbord/Orders'))

const Dashbord = lazy(() => import('pages/Dashbord'))

/* Restricted routes */
const Login = lazy(() => import('pages/Login'))
const Register = lazy(() => import('pages/Register'))

/* Error routes */
const Page404 = lazy(() => import('pages/Page404'))

export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  {
    type: RouteType.RESTRICTED,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/signup',
    children: <Register />,
  },

  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/dashbord',
    children: <Dashboard />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/users',
    children: <DashbordUsers />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/users/add',
    children: <DashbordUsersAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/users/edit',
    children: <DashbordUsersEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/roles',
    children: <DashbordRoles />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/roles/add',
    children: <DashbordRolesAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/roles/edit',
    children: <DashbordRolesEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/products',
    children: <DashbordProducts />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/products/add',
    children: <DashbordProductsAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashbord/products/edit',
    children: <DashbordProductsEdit />,
  },
  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },
  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
]

const Routes: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            )
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            )
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          )
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  )
}

export default Routes
