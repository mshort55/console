/* Copyright Contributors to the Open Cluster Management project */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom-v5-compat'
import { AccessControl } from '../../resources/access-control'
import { AccessControlManagementForm } from './AccessControlManagementForm'
import { useAccessControlFilter } from './AccessControlManagementTableHelper'

const EditAcessControlManagementPage = () => {
  const { id = undefined } = useParams()
  const accessControls = useAccessControlFilter()
  const [accessControl, setAccessControl] = useState<AccessControl | undefined>()

  useEffect(() => {
    if (id) {
      setAccessControl(accessControls.find((e) => e.metadata?.uid === id))
    }
  }, [accessControls, id])

  return (
    <AccessControlManagementForm isCreatable={false} isEditing={true} isViewing={false} accessControl={accessControl} />
  )
}

export { EditAcessControlManagementPage }
