/* Copyright Contributors to the Open Cluster Management project */

import { PageSection } from '@patternfly/react-core'
import { cellWidth } from '@patternfly/react-table'
import { useMemo } from 'react'
import { useTranslation } from '../../../../lib/acm-i18next'
import { AcmTable, IAcmTableColumn } from '../../../../ui-components'

interface Permission {
  id: string
  actions: string[]
  apiGroups: string[]
  resources: string[]
}

const mockPermissions: Permission[] = [
  {
    id: '1',
    actions: ['use'],
    apiGroups: ['security.openshift.io'],
    resources: ['SCC securitycontextconstraints'],
  },
  {
    id: '2',
    actions: ['get', 'list', 'watch', 'update', 'patch'],
    apiGroups: ['operator.openshift.io'],
    resources: ['CCSI clustercsidrivers'],
  },
  {
    id: '3',
    actions: ['get', 'list', 'watch', 'update', 'patch'],
    apiGroups: ['operator.openshift.io'],
    resources: ['CCSI clustercsidrivers/status'],
  },
  {
    id: '4',
    actions: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete'],
    apiGroups: [],
    resources: ['CM configmaps'],
  },
  {
    id: '5',
    actions: ['watch', 'list', 'get'],
    apiGroups: [],
    resources: ['CM configmaps'],
  },
  {
    id: '6',
    actions: ['watch', 'list', 'get', 'create', 'delete', 'patch', 'update'],
    apiGroups: ['rbac.authorization.k8s.io'],
    resources: ['CRB clusterrolebindings'],
  },
  {
    id: '7',
    actions: ['watch', 'list', 'get', 'create', 'delete', 'patch', 'update'],
    apiGroups: ['rbac.authorization.k8s.io'],
    resources: ['CR clusterroles', 'RB rolebindings', 'R roles'],
  },
]

export function Permissions() {
  const { t } = useTranslation()

  const columns = useMemo<IAcmTableColumn<Permission>[]>(
    () => [
      {
        header: t('Actions'),
        sort: 'actions',
        search: 'actions',
        cell: (item) => {
          return (
            <div>
              {item.actions.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </div>
          )
        },
        transforms: [cellWidth(15)],
      },
      {
        header: t('API groups'),
        sort: 'apiGroups',
        search: 'apiGroups',
        cell: (item) => {
          return item.apiGroups.length > 0 ? item.apiGroups.join(', ') : ''
        },
        transforms: [cellWidth(25)],
      },
      {
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
