/* Copyright Contributors to the Open Cluster Management project */
import { useEffect, useState, useCallback } from 'react'
import { ClusterRoleBinding, RoleBinding } from '../../resources/access-control'

const useRoleBinding = <T>() => {
  const [selected, setSelected] = useState<T[]>([])
  const [selectedSubjectKind, setSelectedSubjectKind] = useState<'User' | 'Group'>('User')
  const [selectedSubjectNames, setSelectedSubjectNames] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedRoleNames, setSelectedRoleNames] = useState<string[]>([])
  const [selectedRoleName, setSelectedRoleName] = useState<string>()
  const [selectedNamespaces, setSelectedNamespaces] = useState<string[]>([])

  useEffect(() => {
    switch (selectedSubjectKind) {
      case 'Group':
        setSelectedGroups(selectedSubjectNames)
        break
      case 'User':
        setSelectedUsers(selectedSubjectNames)
        break
    }
  }, [selectedSubjectNames, selectedSubjectKind])

  const onNamespaceChange = (values: string[]) => setSelectedNamespaces(values)
  const onSubjectKindChange = (value: string) => {
    setSelectedSubjectNames(value === 'group' ? selectedGroups : selectedUsers)
    setSelectedSubjectKind(value === 'group' ? 'Group' : 'User')
  }
  const onSubjectNameChange = (values: string[]) => setSelectedSubjectNames(values)
  const onRoleChange = (values: string[]) => {
    setSelectedRoleNames(values)
    setSelectedRoleName((values?.length && values[0]) || '')
  }

  const setCurrentSubjectKind = useCallback((roleBinding: RoleBinding[] | ClusterRoleBinding) => {
    let firstSubjectKind: 'User' | 'Group' | undefined
    if (Array.isArray(roleBinding)) {
      // RoleBinding
      firstSubjectKind = roleBinding[0]?.subject?.kind || roleBinding[0]?.subjects?.[0].kind
    } else {
      // ClusterRoleBinding
      firstSubjectKind = roleBinding?.subject?.kind || roleBinding?.subjects?.[0].kind
    }

    if (firstSubjectKind) {
      setSelectedSubjectKind(firstSubjectKind)
    }
  }, [])

  return {
    selected,
    selectedSubjectKind,
    selectedSubjectNames,
    selectedRoleName,
    selectedRoleNames,
    selectedNamespaces,
    setSelected,
    setSelectedSubjectNames,
    setSelectedRoleName,
    setSelectedRoleNames,
    setSelectedNamespaces,
    setCurrentSubjectKind,
    onNamespaceChange,
    onSubjectKindChange,
    onSubjectNameChange,
    onRoleChange,
  }
}

export { useRoleBinding }
