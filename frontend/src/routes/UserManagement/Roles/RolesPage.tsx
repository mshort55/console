/* Copyright Contributors to the Open Cluster Management project */
import { useTranslation } from '../../../lib/acm-i18next'
import { AcmPage, AcmPageContent, AcmPageHeader } from '../../../ui-components'
import { RolesTable } from './RolesTable'

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
