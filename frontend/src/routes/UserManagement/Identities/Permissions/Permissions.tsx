/* Copyright Contributors to the Open Cluster Management project */

import { PageSection, Label, Flex, FlexItem } from '@patternfly/react-core'
import { cellWidth } from '@patternfly/react-table'
import { useMemo } from 'react'
import { useTranslation } from '../../../../lib/acm-i18next'
import { AcmTable, IAcmTableColumn, compareStrings } from '../../../../ui-components'
import { ClusterRole } from '../../../../resources/rbac'
import { Rule } from '../../../../resources/kubernetes-client'
import clusterRoleData from './mock-data/kubevirt.io:admin.json'

const clusterRole = clusterRoleData as ClusterRole
const rules: Rule[] = clusterRole.rules

const blacklist = ['ASS', 'FART']
export const kindToAbbreviation = (kind: string) => {
  const abbreviatedKind = (kind.replace(/[^A-Z]/g, '') || kind.toUpperCase()).slice(0, 4)
  return blacklist.includes(abbreviatedKind) ? abbreviatedKind.slice(0, -1) : abbreviatedKind
}

export function Permissions() {
  const { t } = useTranslation()

  const columns = useMemo<IAcmTableColumn<Rule>[]>(
    () => [
      {
        id: 'actions',
        header: t('Actions'),
        sort: (a: Rule, b: Rule) => compareStrings(a.verbs.join(', '), b.verbs.join(', ')),
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
        sort: (a: Rule, b: Rule) => compareStrings(a.apiGroups.join(', '), b.apiGroups.join(', ')),
        search: 'apiGroups',
        cell: (item) => {
          return item.apiGroups.length > 0 ? item.apiGroups.join(', ') : ''
        },
        transforms: [cellWidth(25)],
      },
      {
        id: 'resources',
        header: t('Resources'),
        sort: (a: Rule, b: Rule) => compareStrings(a.resources.join(', '), b.resources.join(', ')),
        search: 'resources',
        cell: (item) => {
          return (
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              {item.resources.map((resource, index) => (
                <FlexItem key={index}>
                  <Label isCompact color="blue">
                    {kindToAbbreviation(resource)}
                  </Label>{' '}
                  {resource}
                </FlexItem>
              ))}
            </Flex>
          )
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
        autoHidePagination={true}
        initialPerPage={100}
        fuseThreshold={0.1}
      />
    </PageSection>
  )
}
