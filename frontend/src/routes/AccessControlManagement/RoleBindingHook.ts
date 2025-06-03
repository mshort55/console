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
    setRoleBinding((prev) => {
      const updatedState = {
        ...prev,
        users: prev.subjectKind === 'User' ? prev.subjectNames : prev.users,
        groups: prev.subjectKind === 'Group' ? prev.subjectNames : prev.groups,
      }
      return updatedState
    })
  }, [roleBinding.subjectNames])

  useEffect(
    () => setIsValid(roleBinding.roleNames.length > 0 && roleBinding.subjectNames.length > 0),
    [roleBinding.roleNames, roleBinding.subjectNames]
  )

  const setSubjectKind = (value: string) => {
    const newSubjectKind = value === 'group' ? 'Group' : 'User'

    setRoleBinding((prev) => {
      const savedUsers = prev.subjectKind === 'User' ? prev.subjectNames : prev.users
      const savedGroups = prev.subjectKind === 'Group' ? prev.subjectNames : prev.groups
      const newSubjectNames = newSubjectKind === 'User' ? savedUsers : savedGroups

      return {
        ...prev,
        subjectKind: newSubjectKind,
        subjectNames: newSubjectNames,
        users: savedUsers,
        groups: savedGroups,
      }
    })
  }

  const setSubjectNames = (values: string[]) => setRoleBinding((prev) => ({ ...prev, subjectNames: values }))
  const setRoleNames = (values: string[]) => setRoleBinding((prev) => ({ ...prev, roleNames: values }))
  const setNamespaces = (values: string[]) => setRoleBinding((prev) => ({ ...prev, namespaces: values }))

  const onAccessControlRoleBindingChange = useCallback((newRoleBinding: RoleBinding[] | ClusterRoleBinding) => {
    if (newRoleBinding) {
      const namespaces: string[] = Array.isArray(newRoleBinding)
        ? [...new Set((newRoleBinding as RoleBinding[]).filter((rb) => rb.namespace).map((rb) => rb.namespace))]
        : [
            ...new Set(
              (newRoleBinding as ClusterRoleBinding).subjects?.filter((s) => s.namespace).map((s) => s.namespace)
            ),
          ].filter((e) => e !== undefined)

      const subjectKind: 'User' | 'Group' | undefined = Array.isArray(newRoleBinding)
        ? newRoleBinding[0]?.subject?.kind || newRoleBinding[0]?.subjects?.[0].kind
        : newRoleBinding?.subject?.kind || newRoleBinding?.subjects?.[0].kind

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

      const roleNames: string[] = Array.isArray(newRoleBinding)
        ? [...new Set(newRoleBinding.map((rb) => rb.roleRef.name))]
        : newRoleBinding.roleRef?.name
          ? [newRoleBinding.roleRef.name]
          : []

      setRoleBinding((prev) => ({
        ...prev,
        namespaces,
        subjectKind: subjectKind || prev.subjectKind,
        subjectNames,
        roleNames,
        users: subjectKind === 'User' ? subjectNames : prev.users,
        groups: subjectKind === 'Group' ? subjectNames : prev.groups,
      }))
    }
  }, [])

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
