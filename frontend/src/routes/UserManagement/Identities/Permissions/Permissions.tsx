/* Copyright Contributors to the Open Cluster Management project */

import { PageSection } from '@patternfly/react-core'
import { cellWidth } from '@patternfly/react-table'
import { useMemo } from 'react'
import { useTranslation } from '../../../../lib/acm-i18next'
import { AcmTable, IAcmTableColumn } from '../../../../ui-components'
import clusterRoleData from './mock-data/kubevirt.io:admin.json'

interface Permission {
  id: string
  actions: string[]
  apiGroups: string[]
  resources: string[]
}

const mockPermissions: Permission[] = clusterRoleData.rules.map((rule, index) => ({
  id: `${index + 1}`,
  actions: rule.verbs,
  apiGroups: rule.apiGroups,
  resources: rule.resources,
}))

export function Permissions() {
  const { t } = useTranslation()

  const columns = useMemo<IAcmTableColumn<Permission>[]>(
    () => [
      {
        id: 'actions',
        header: t('Actions'),
        sort: 'actions',
        search: 'actions',
        cell: (item) => {
          return (
            <div>
              {item.actions.map((action, index) => (
                <div key={index}>
                  <strong>{action}</strong>
                </div>
              ))}
            </div>
          )
        },
        transforms: [cellWidth(15)],
      },
      {
        id: 'apiGroups',
        header: t('API groups'),
        sort: 'apiGroups',
        search: 'apiGroups',
        cell: (item) => {
          return item.apiGroups.length > 0 ? item.apiGroups.join(', ') : ''
        },
        transforms: [cellWidth(25)],
      },
      {
        id: 'resources',
        header: t('Resources'),
        sort: 'resources',
        search: 'resources',
        cell: (item) => {
          return item.resources.join(', ')
        },
        transforms: [cellWidth(60)],
      },
    ],
    [t]
  )

  const keyFn = (item: Permission) => item.id

  return (
    <PageSection>
      <AcmTable<Permission>
        id="permissions-table"
        key="permissions-table"
        columns={columns}
        keyFn={keyFn}
        items={mockPermissions}
        autoHidePagination
        initialPerPage={100}
        emptyState={<div>{t('No permissions found')}</div>}
      />
    </PageSection>
  )
}
