/* Copyright Contributors to the Open Cluster Management project */
import { useEffect, useState, useCallback } from 'react'
import { ClusterRoleBinding, RoleBinding } from '../../resources/access-control'

const useRoleBinding = () => {
  const [selectedSubjectKind, setSubjectKind] = useState<'User' | 'Group'>('User')
  const [selectedSubjectNames, setSubjectNames] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedRoleNames, setRoleNames] = useState<string[]>([])
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
    setSubjectNames(value === 'group' ? selectedGroups : selectedUsers)
    setSubjectKind(value === 'group' ? 'Group' : 'User')
  }
  const onSubjectNameChange = (values: string[]) => setSubjectNames(values)
  const onRoleChange = (values: string[]) => {
    setRoleNames(values)
  }

  const setSelectedSubjectKind = useCallback((roleBinding: RoleBinding[] | ClusterRoleBinding) => {
    let firstSubjectKind: 'User' | 'Group' | undefined
    if (Array.isArray(roleBinding)) {
      // RoleBinding
      firstSubjectKind = roleBinding[0]?.subject?.kind || roleBinding[0]?.subjects?.[0].kind
    } else {
      // ClusterRoleBinding
      firstSubjectKind = roleBinding?.subject?.kind || roleBinding?.subjects?.[0].kind
    }

    if (firstSubjectKind) {
      setSubjectKind(firstSubjectKind)
    }
  }, [])

  const setSelectedSubjectNames = useCallback((roleBinding: RoleBinding[] | ClusterRoleBinding) => {
    let subjectNames: string[]
    if (Array.isArray(roleBinding)) {
      // RoleBinding
      subjectNames = [
        ...new Set(
          roleBinding.flatMap((rb) => (rb.subject ? [rb.subject.name] : rb.subjects?.map((s) => s.name) ?? []))
        ),
      ]
    } else {
      // ClusterRoleBinding
      subjectNames = [
        ...new Set(roleBinding.subjects?.map((s) => s.name) ?? (roleBinding.subject ? [roleBinding.subject.name] : [])),
      ]
    }

    setSubjectNames(subjectNames)
  }, [])

  const setSelectedRoleNames = useCallback((roleBinding: RoleBinding[] | ClusterRoleBinding) => {
    let roleNames: string[]
    if (Array.isArray(roleBinding)) {
      // RoleBinding
      roleNames = [...new Set(roleBinding.map((rb) => rb.roleRef.name))]
    } else {
      // ClusterRoleBinding
      roleNames = roleBinding.roleRef?.name ? [roleBinding.roleRef.name] : []
    }

    setRoleNames(roleNames)
  }, [])

  return {
    selectedSubjectKind,
    selectedSubjectNames,
    selectedRoleNames,
    selectedNamespaces,
    setSelectedRoleNames,
    setSelectedNamespaces,
    setSelectedSubjectKind,
    setSelectedSubjectNames,
    onNamespaceChange,
    onSubjectKindChange,
    onSubjectNameChange,
    onRoleChange,
  }
}

export { useRoleBinding }
