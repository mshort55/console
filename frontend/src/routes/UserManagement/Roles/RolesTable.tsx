/* Copyright Contributors to the Open Cluster Management project */
import { PageSection } from '@patternfly/react-core'
import { useMemo, useCallback } from 'react'
import { useTranslation } from '../../../lib/acm-i18next'
import { useQuery } from '../../../lib/useQuery'
import { listVirtualizationClusterRoles, ClusterRole } from '../../../resources/rbac'
import { AcmEmptyState, AcmTable, compareStrings, AcmLoadingPage } from '../../../ui-components'
import { rolesTableColumns, useFilters, Role } from './RolesTableHelper'

const RolesTable = () => {
  const { t } = useTranslation()
  const { data: clusterRoles, loading } = useQuery(listVirtualizationClusterRoles)

  const roles = useMemo(() => {
    if (!clusterRoles) return []

    return clusterRoles
      .map(
        (clusterRole: ClusterRole): Role => ({
          name: clusterRole.metadata.name || '',
          description: 'kubevirt.io cluster role',
          category: 'Virtualization',
          type: 'ClusterRole',
          permissions: 'TBD',
          uid: clusterRole.metadata.uid || clusterRole.metadata.name || '',
        })
      )
      .sort((a, b) => compareStrings(a.name, b.name))
  }, [clusterRoles])

  const keyFn = useCallback((role: Role) => role.uid, [])

  const filters = useFilters()
  const columns = rolesTableColumns({ t })

  return (
    <PageSection>
      {loading ? (
        <AcmLoadingPage />
      ) : (
        <AcmTable<Role>
          key="roles-table"
          filters={filters}
          columns={columns}
          keyFn={keyFn}
          items={roles}
          emptyState={<AcmEmptyState key="rolesEmptyState" title={t('No roles')} />}
        />
      )}
    </PageSection>
  )
}

export { RolesTable }
