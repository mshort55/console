/* Copyright Contributors to the Open Cluster Management project */
import { cellWidth } from '@patternfly/react-table'
import { useMemo } from 'react'
import { TFunction } from 'react-i18next'
import { generatePath, Link } from 'react-router-dom-v5-compat'
import { HighlightSearchText } from '../../../components/HighlightSearchText'
import { NavigationPath } from '../../../NavigationPath'
import { IAcmTableColumn } from '../../../ui-components/AcmTable/AcmTableTypes'

import { Label } from '@patternfly/react-core'

const EXPORT_FILE_PREFIX = 'roles-table'

export interface Role {
  name: string
  description: string
  category: string
  type: string
  permissions: string
  uid: string
}

type RolesTableHelperProps = {
  t: TFunction
}

const COLUMN_CELLS = {
  NAME: (role: Role, search: string) => (
    <span style={{ whiteSpace: 'nowrap' }}>
      <Link to={generatePath(NavigationPath.rolesDetails, { id: role.uid })}>
        <HighlightSearchText text={role.name} searchText={search} isTruncate />
      </Link>
    </span>
  ),
  DESCRIPTION: (role: Role) => <span style={{ whiteSpace: 'nowrap' }}>{role.description}</span>,
  CATEGORY: (role: Role) => <Label variant="outline">{role.category}</Label>,
  TYPE: (role: Role) => <span style={{ whiteSpace: 'nowrap' }}>{role.type}</span>,
  PERMISSIONS: (role: Role) => <span style={{ whiteSpace: 'nowrap' }}>{role.permissions}</span>,
}

export const rolesTableColumns = ({ t }: Pick<RolesTableHelperProps, 't'>): IAcmTableColumn<Role>[] => [
  {
    header: t('Role'),
    sort: 'name',
    search: 'name',
    transforms: [cellWidth(25)],
    cell: (role, search) => COLUMN_CELLS.NAME(role, search),
    exportContent: (role) => role.name,
  },
  {
    header: t('Description'),
    sort: 'description',
    search: 'description',
    transforms: [cellWidth(30)],
    cell: (role) => COLUMN_CELLS.DESCRIPTION(role),
    exportContent: (role) => role.description,
  },
  {
    header: t('Category'),
    sort: 'category',
    transforms: [cellWidth(15)],
    cell: (role) => COLUMN_CELLS.CATEGORY(role),
    exportContent: (role) => role.category,
  },
  {
    header: t('Type'),
    sort: 'type',
    transforms: [cellWidth(15)],
    cell: (role) => COLUMN_CELLS.TYPE(role),
    exportContent: (role) => role.type,
  },
  {
    header: t('Permissions'),
    sort: 'permissions',
    transforms: [cellWidth(15)],
    cell: (role) => COLUMN_CELLS.PERMISSIONS(role),
    exportContent: (role) => role.permissions.toString(),
  },
]

export const useFilters = () => {
  return useMemo(
    () => [
      {
        id: 'category',
        label: 'Category',
        tableFilterFn: (selection: string[], role: Role) => {
          if (selection.length === 0) return true
          return selection.some((selected: string) => role.category === selected)
        },
        options: [
          { label: 'System', value: 'System' },
          { label: 'Custom', value: 'Custom' },
          { label: 'Default', value: 'Default' },
        ],
      },
      {
        id: 'type',
        label: 'Type',
        tableFilterFn: (selection: string[], role: Role) => {
          if (selection.length === 0) return true
          return selection.some((selected: string) => role.type === selected)
        },
        options: [
          { label: 'ClusterRole', value: 'ClusterRole' },
          { label: 'Role', value: 'Role' },
        ],
      },
    ],
    []
  )
}

export { EXPORT_FILE_PREFIX, COLUMN_CELLS }
