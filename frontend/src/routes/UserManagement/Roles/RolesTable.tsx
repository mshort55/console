/* Copyright Contributors to the Open Cluster Management project */
import { PageSection } from '@patternfly/react-core'
import { useMemo, useCallback } from 'react'
import { useTranslation } from '../../../lib/acm-i18next'
import { AcmEmptyState, AcmTable, compareStrings } from '../../../ui-components'
import { rolesTableColumns, useFilters, Role } from './RolesTableHelper'

const mockRoles: Role[] = [
  {
    name: 'cluster-admin',
    description: 'Full administrative access to the cluster',
    category: 'System',
    type: 'ClusterRole',
    permissions: 156,
    uid: 'cluster-admin-uid-1',
  },
  {
    name: 'view',
    description: 'Read-only access to most objects in the cluster',
    category: 'System',
    type: 'ClusterRole',
    permissions: 45,
    uid: 'view-uid-2',
  },
  {
    name: 'edit',
    description: 'Read and write access to most objects in a namespace',
    category: 'System',
    type: 'Role',
    permissions: 78,
    uid: 'edit-uid-3',
  },
]

const RolesTable = () => {
  const { t } = useTranslation()
  const roles = useMemo(() => mockRoles?.sort((a, b) => compareStrings(a.name, b.name)) ?? [], [])

  const keyFn = useCallback((role: Role) => role.uid, [])

  const filters = useFilters()
  const columns = rolesTableColumns({ t })

  // TODO: implement loading page?

  return (
    <PageSection>
      {
        <AcmTable<Role>
          key="roles-table"
          filters={filters}
          columns={columns}
          keyFn={keyFn}
          items={roles}
          emptyState={<AcmEmptyState key="rolesEmptyState" title={t('No roles')} />}
        />
      }
    </PageSection>
  )
}

export { RolesTable }
