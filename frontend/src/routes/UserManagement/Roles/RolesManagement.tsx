/* Copyright Contributors to the Open Cluster Management project */
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat'
import { NavigationPath, createRoutePathFunction } from '../../../NavigationPath'
import { RolesPage, RolesContextProvider } from './RolesPage'
import { RolePage } from './RolePage'
import { RoleDetail } from './RoleDetail'
import { RoleYaml } from './RoleYaml'
import { RolePermissions } from './RolePermissions'
import { RoleAssignments } from './RoleAssignments'

const rolesChildPath = createRoutePathFunction(NavigationPath.roles)

export default function RolesManagement() {
  return (
    <RolesContextProvider>
      <Routes>
        {/* Individual role page tabs */}
        <Route path={rolesChildPath(NavigationPath.roleDetails)} element={<RolePage />}>
          <Route index element={<RoleDetail />} />
        </Route>
        <Route path={rolesChildPath(NavigationPath.rolePermissions)} element={<RolePage />}>
          <Route index element={<RolePermissions />} />
        </Route>
        <Route path={rolesChildPath(NavigationPath.roleRoleAssignments)} element={<RolePage />}>
          <Route index element={<RoleAssignments />} />
        </Route>
        <Route path={rolesChildPath(NavigationPath.roleYaml)} element={<RolePage />}>
          <Route index element={<RoleYaml />} />
        </Route>

        {/* Main roles page with list of roles */}
        <Route path={rolesChildPath(NavigationPath.roles)} element={<RolesPage />} />

        {/* Default redirect to roles */}
        <Route path="*" element={<Navigate to={NavigationPath.roles} replace />} />
      </Routes>
    </RolesContextProvider>
  )
}
