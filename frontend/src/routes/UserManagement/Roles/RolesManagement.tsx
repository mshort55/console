/* Copyright Contributors to the Open Cluster Management project */
import { Navigate, Route, Routes } from 'react-router-dom-v5-compat'
import { NavigationPath, createRoutePathFunction } from '../../../NavigationPath'
import { RolesPage } from './RolesPage'
import { RoleDetail } from './RoleDetail'
import { RoleYaml } from './RoleYaml'
import { RolePermissions } from './RolePermissions'
import { RoleAssignments } from './RoleAssignments'

const rolesChildPath = createRoutePathFunction(NavigationPath.roles)

export default function RolesManagement() {
  return (
    <Routes>
      {/* Main roles page */}
      <Route path={rolesChildPath(NavigationPath.roles)} element={<RolesPage />} />

      {/* Role detail routes */}
      <Route path={rolesChildPath(NavigationPath.rolesYaml)} element={<RoleYaml />} />
      <Route path={rolesChildPath(NavigationPath.rolesPermissions)} element={<RolePermissions />} />
      <Route path={rolesChildPath(NavigationPath.rolesRoleAssignments)} element={<RoleAssignments />} />
      <Route path={rolesChildPath(NavigationPath.rolesDetails)} element={<RoleDetail />} />

      <Route path="*" element={<Navigate to={NavigationPath.roles} replace />} />
    </Routes>
  )
}
