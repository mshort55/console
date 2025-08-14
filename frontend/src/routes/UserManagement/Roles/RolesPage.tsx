/* Copyright Contributors to the Open Cluster Management project */
import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useParams } from 'react-router-dom-v5-compat'
import { useTranslation } from '../../../lib/acm-i18next'
import { useQuery } from '../../../lib/useQuery'
import { listVirtualizationClusterRoles, ClusterRole } from '../../../resources/rbac'
import { AcmPage, AcmPageContent, AcmPageHeader } from '../../../ui-components'
import { RolesTable } from './RolesTable'

export type RolesContextType = {
  clusterRoles?: ClusterRole[]
  loading: boolean
}

const RolesContext = createContext<RolesContextType | undefined>(undefined)

export const useRolesContext = () => {
  const context = useContext(RolesContext)
  if (!context) {
    throw new Error('useRolesContext must be used within RolesContextProvider')
  }
  return context
}

export const useCurrentRole = () => {
  const { id } = useParams()
  const { clusterRoles } = useRolesContext()

  return useMemo(() => {
    if (!clusterRoles || !id) return undefined
    return clusterRoles.find((r) => r.metadata.uid === id || r.metadata.name === id)
  }, [clusterRoles, id])
}

export const RolesContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: clusterRoles, loading } = useQuery(listVirtualizationClusterRoles)
  //TODO: look into hanging apicalls at apiPaths that proceeds this api call which causes stuck loading page

  const contextValue: RolesContextType = {
    clusterRoles,
    loading,
  }

  return <RolesContext.Provider value={contextValue}>{children}</RolesContext.Provider>
}

const RolesPage = () => {
  const { t } = useTranslation()

  // TODO: implement loading page?
  // TODO: check page for rbac permission?
  return (
    <AcmPage
      header={
        <AcmPageHeader
          title={t('Roles')}
          description={t('Manage roles and permissions')}
          breadcrumb={[{ text: t('User Management') }, { text: t('Roles') }]}
        />
      }
    >
      <AcmPageContent id="roles">
        <RolesTable />
      </AcmPageContent>
    </AcmPage>
  )
}

export { RolesPage }
