/* Copyright Contributors to the Open Cluster Management project */

import { PageSection } from '@patternfly/react-core'
import { cellWidth } from '@patternfly/react-table'
import { useMemo } from 'react'
import { useTranslation } from '../../../../lib/acm-i18next'
import { AcmTable, IAcmTableColumn } from '../../../../ui-components'
import { ClusterRole } from '../../../../resources/rbac'
import { Rule } from '../../../../resources/kubernetes-client'
import clusterRoleData from './mock-data/kubevirt.io:admin.json'

const clusterRole = clusterRoleData as ClusterRole
const rules: Rule[] = clusterRole.rules

export function Permissions() {
  const { t } = useTranslation()

  const columns = useMemo<IAcmTableColumn<Rule>[]>(
    () => [
      {
        id: 'verbs',
        header: t('Actions'),
        sort: 'verbs',
        search: 'verbs',
        cell: (item) => {
          return (
            <div>
              {item.verbs.map((verb, index) => (
                <div key={index}>
                  <strong>{verb}</strong>
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
          return item.resources.join(' ')
        },
        transforms: [cellWidth(60)],
      },
    ],
    [t]
  )

  const keyFn = (rule: Rule) => `rule-${rules.indexOf(rule)}`

  return (
    <PageSection>
      <AcmTable<Rule>
        id="permissions-table"
        key="permissions-table"
        columns={columns}
        keyFn={keyFn}
        items={rules}
        emptyState={<div>{t('No permissions found')}</div>}
      />
    </PageSection>
  )
}
