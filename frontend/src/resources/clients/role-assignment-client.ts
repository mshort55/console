/* Copyright Contributors to the Open Cluster Management project */
import { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState, useSharedAtoms } from '../../shared-recoil'
import { RoleAssignment } from '../role-assignment'
import mockRoleAssignments from './mock-data/role-assignments.json'

export function useRoleAssignments() {
  const { roleAssignmentsState } = useSharedAtoms()
  const roleAssignments = useRecoilValue(roleAssignmentsState)
  const setRoleAssignments = useSetRecoilState(roleAssignmentsState)

  const initializeMockData = useCallback(() => {
    setRoleAssignments(mockRoleAssignments as RoleAssignment[])
  }, [setRoleAssignments])

  const addRoleAssignment = useCallback(
    (roleAssignment: RoleAssignment) => {
      setRoleAssignments((prev) => [...prev, roleAssignment])
    },
    [setRoleAssignments]
  )

  const updateRoleAssignment = useCallback(
    (updatedRoleAssignment: RoleAssignment) => {
      setRoleAssignments((prev) =>
        prev.map((ra) => (ra.metadata.name === updatedRoleAssignment.metadata.name ? updatedRoleAssignment : ra))
      )
    },
    [setRoleAssignments]
  )

  const deleteRoleAssignment = useCallback(
    (name: string) => {
      setRoleAssignments((prev) => prev.filter((ra) => ra.metadata.name !== name))
    },
    [setRoleAssignments]
  )

  return {
    roleAssignments,
    initializeMockData,
    addRoleAssignment,
    updateRoleAssignment,
    deleteRoleAssignment,
  }
}
