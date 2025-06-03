/* Copyright Contributors to the Open Cluster Management project */
import { useCallback, useEffect, useState } from 'react'
import { ClusterRoleBinding, RoleBinding } from '../../resources/access-control'

export type RoleBindingHookType = {
  subjectKind: 'User' | 'Group'
  subjectNames: string[]
  users: string[]
  groups: string[]
  roleNames: string[]
  namespaces: string[]
}

const useRoleBinding = () => {
  const [roleBinding, setRoleBinding] = useState<RoleBindingHookType>({
    subjectKind: 'User',
    subjectNames: [],
    users: [],
    groups: [],
    roleNames: [],
    namespaces: [],
  })
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    switch (roleBinding.subjectKind) {
      case 'Group':
        setRoleBinding({ ...roleBinding, groups: roleBinding.subjectNames })
        break
      case 'User':
        setRoleBinding({ ...roleBinding, users: roleBinding.subjectNames })
        break
    }
  }, [roleBinding])

  useEffect(
    () => setIsValid(roleBinding.roleNames.length > 0 && roleBinding.subjectNames.length > 0),
    [roleBinding.roleNames, roleBinding.subjectNames]
  )

  const setSubjectKind = (value: string) =>
    setRoleBinding({ ...roleBinding, subjectKind: value === 'group' ? 'Group' : 'User' })
  const setSubjectNames = (values: string[]) => setRoleBinding({ ...roleBinding, subjectNames: values })
  const setRoleNames = (values: string[]) => setRoleBinding({ ...roleBinding, roleNames: values })

  const setNamespaces = (values: string[]) => setRoleBinding({ ...roleBinding, namespaces: values })

  const onNamespaceChange = useCallback(
    (newRoleBinding: RoleBinding[] | ClusterRoleBinding) => {
      const namespaces: string[] = Array.isArray(newRoleBinding)
        ? [...new Set((newRoleBinding as RoleBinding[]).filter((rb) => rb.namespace).map((rb) => rb.namespace))]
        : [
            ...new Set(
              (newRoleBinding as ClusterRoleBinding).subjects?.filter((s) => s.namespace).map((s) => s.namespace)
            ),
          ].filter((e) => e !== undefined)
      setRoleBinding({ ...roleBinding, namespaces })
    },
    [roleBinding]
  )

  const onSubjectKindChange = useCallback(
    (newRoleBinding: RoleBinding[] | ClusterRoleBinding) => {
      const subjectKind: 'User' | 'Group' | undefined = Array.isArray(newRoleBinding)
        ? newRoleBinding[0]?.subject?.kind || newRoleBinding[0]?.subjects?.[0].kind
        : newRoleBinding?.subject?.kind || newRoleBinding?.subjects?.[0].kind

      if (subjectKind) {
        setRoleBinding({ ...roleBinding, subjectKind })
      }
    },
    [roleBinding]
  )

  const onSubjectNamesChange = useCallback(
    (newRoleBinding: RoleBinding[] | ClusterRoleBinding) => {
      const subjectNames: string[] = Array.isArray(newRoleBinding)
        ? [
            ...new Set(
              newRoleBinding.flatMap((rb) => (rb.subject ? [rb.subject.name] : rb.subjects?.map((s) => s.name) ?? []))
            ),
          ]
        : [
            ...new Set(
              newRoleBinding.subjects?.map((s) => s.name) ??
                (newRoleBinding.subject ? [newRoleBinding.subject.name] : [])
            ),
          ]
      setRoleBinding({ ...roleBinding, subjectNames: subjectNames })
    },
    [roleBinding]
  )

  const onRoleNamesChange = useCallback(
    (newRoleBinding: RoleBinding[] | ClusterRoleBinding) => {
      let roleNames: string[]
      if (Array.isArray(newRoleBinding)) {
        // RoleBinding
        roleNames = [...new Set(newRoleBinding.map((rb) => rb.roleRef.name))]
      } else {
        // ClusterRoleBinding
        roleNames = newRoleBinding.roleRef?.name ? [newRoleBinding.roleRef.name] : []
      }
      setRoleBinding({ ...roleBinding, roleNames: roleNames })
    },
    [roleBinding]
  )

  const onAccessControlRoleBindingChange = (newRoleBinding: RoleBinding[] | ClusterRoleBinding) => {
    if (newRoleBinding) {
      onSubjectNamesChange(newRoleBinding)
      onRoleNamesChange(newRoleBinding)
      onSubjectKindChange(newRoleBinding)
      onNamespaceChange(newRoleBinding)
    }
  }

  return {
    roleBinding,
    isValid,
    setSubjectKind,
    setSubjectNames,
    setRoleNames,
    setNamespaces,
    onAccessControlRoleBindingChange,
  }
}

export { useRoleBinding }
