/* Copyright Contributors to the Open Cluster Management project */
import { PageSection } from '@patternfly/react-core'
//import { useTranslation } from '../../../lib/acm-i18next'
import { useCurrentRole } from '../RolesPage'

const RoleYaml = () => {
  //const { t } = useTranslation()
  const role = useCurrentRole()

  return <PageSection>Role YAML page for Role: {role?.metadata.name}</PageSection>
}

export { RoleYaml }
