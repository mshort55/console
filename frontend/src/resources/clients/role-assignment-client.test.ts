/* Copyright Contributors to the Open Cluster Management project */
import { renderHook, act } from '@testing-library/react-hooks'
import { useRoleAssignments } from './role-assignment-client'
import { RoleAssignment } from '../role-assignment'
import { useRecoilValue, useSetRecoilState, useSharedAtoms } from '../../shared-recoil'
import mockRoleAssignments from './mock-data/role-assignments.json'

// Mock recoil functions
jest.mock('../../shared-recoil', () => ({
  useRecoilValue: jest.fn(),
  useSetRecoilState: jest.fn(),
  useSharedAtoms: jest.fn(),
}))

describe('useRoleAssignments', () => {
  const mockSetRoleAssignments = jest.fn()
  const mockRoleAssignmentsState = { key: 'roleAssignmentsState' } as any
  const typedMockRoleAssignments = mockRoleAssignments as RoleAssignment[]

  // Get the mocked functions
  const mockUseRecoilValue = useRecoilValue as jest.MockedFunction<typeof useRecoilValue>
  const mockUseSetRecoilState = useSetRecoilState as jest.MockedFunction<typeof useSetRecoilState>
  const mockUseSharedAtoms = useSharedAtoms as jest.MockedFunction<typeof useSharedAtoms>

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSharedAtoms.mockReturnValue({
      roleAssignmentsState: mockRoleAssignmentsState,
    } as any)
    mockUseRecoilValue.mockReturnValue(typedMockRoleAssignments)
    mockUseSetRecoilState.mockReturnValue(mockSetRoleAssignments)
  })

  it('should return current role assignments from state', () => {
    const { result } = renderHook(() => useRoleAssignments())

    expect(result.current.roleAssignments).toEqual(typedMockRoleAssignments)
    expect(mockUseRecoilValue).toHaveBeenCalledWith(mockRoleAssignmentsState)
  })

  it('should initialize mock data', () => {
    const { result } = renderHook(() => useRoleAssignments())

    act(() => {
      result.current.initializeMockData()
    })

    expect(mockSetRoleAssignments).toHaveBeenCalledWith(typedMockRoleAssignments)
  })

  it('should add a new role assignment', () => {
    const { result } = renderHook(() => useRoleAssignments())
    const newRoleAssignment: RoleAssignment = {
      apiVersion: 'rbac.open-cluster-management.io/v1alpha1',
      kind: 'RoleAssignment',
      metadata: { name: 'new-role' },
      spec: {
        role: 'editor',
        subjects: [
          {
            kind: 'User',
            name: 'newuser',
            clusters: [{ name: 'cluster3', clusterWide: true }],
          },
        ],
      },
    }

    act(() => {
      result.current.addRoleAssignment(newRoleAssignment)
    })

    expect(mockSetRoleAssignments).toHaveBeenCalledWith(expect.any(Function))

    // Test the function passed to setRoleAssignments
    const setterFunction = mockSetRoleAssignments.mock.calls[0][0]
    const newState = setterFunction(typedMockRoleAssignments)
    expect(newState).toEqual([...typedMockRoleAssignments, newRoleAssignment])
  })

  it('should update an existing role assignment', () => {
    const { result } = renderHook(() => useRoleAssignments())
    const updatedRoleAssignment: RoleAssignment = {
      ...typedMockRoleAssignments[0],
      spec: {
        ...typedMockRoleAssignments[0].spec,
        role: 'super-admin',
      },
    }

    act(() => {
      result.current.updateRoleAssignment(updatedRoleAssignment)
    })

    expect(mockSetRoleAssignments).toHaveBeenCalledWith(expect.any(Function))

    // Test the function passed to setRoleAssignments
    const updateSetterFunction = mockSetRoleAssignments.mock.calls[0][0]
    const updatedState = updateSetterFunction(typedMockRoleAssignments)
    expect(updatedState).toEqual([updatedRoleAssignment, ...typedMockRoleAssignments.slice(1)])
  })

  it('should not update role assignment if name does not match', () => {
    const { result } = renderHook(() => useRoleAssignments())
    const nonExistentRoleAssignment: RoleAssignment = {
      apiVersion: 'rbac.open-cluster-management.io/v1alpha1',
      kind: 'RoleAssignment',
      metadata: { name: 'non-existent' },
      spec: {
        role: 'admin',
        subjects: [],
      },
    }

    act(() => {
      result.current.updateRoleAssignment(nonExistentRoleAssignment)
    })

    expect(mockSetRoleAssignments).toHaveBeenCalledWith(expect.any(Function))

    // Test the function passed to setRoleAssignments
    const noUpdateSetterFunction = mockSetRoleAssignments.mock.calls[0][0]
    const unchangedState = noUpdateSetterFunction(typedMockRoleAssignments)
    expect(unchangedState).toEqual(typedMockRoleAssignments) // Should remain unchanged
  })

  it('should delete a role assignment by name', () => {
    const { result } = renderHook(() => useRoleAssignments())

    act(() => {
      result.current.deleteRoleAssignment('cluster-admin-role')
    })

    expect(mockSetRoleAssignments).toHaveBeenCalledWith(expect.any(Function))

    // Test the function passed to setRoleAssignments
    const deleteSetterFunction = mockSetRoleAssignments.mock.calls[0][0]
    const filteredState = deleteSetterFunction(typedMockRoleAssignments)
    // Should remove the first entry (cluster-admin-role) and keep the rest
    expect(filteredState).toEqual(typedMockRoleAssignments.slice(1))
  })

  it('should not delete anything if role assignment name does not exist', () => {
    const { result } = renderHook(() => useRoleAssignments())

    act(() => {
      result.current.deleteRoleAssignment('non-existent-role')
    })

    expect(mockSetRoleAssignments).toHaveBeenCalledWith(expect.any(Function))

    // Test the function passed to setRoleAssignments
    const noDeleteSetterFunction = mockSetRoleAssignments.mock.calls[0][0]
    const stillUnchangedState = noDeleteSetterFunction(typedMockRoleAssignments)
    expect(stillUnchangedState).toEqual(typedMockRoleAssignments) // Should remain unchanged
  })

  it('should return all expected functions and values', () => {
    const { result } = renderHook(() => useRoleAssignments())

    expect(result.current).toHaveProperty('roleAssignments')
    expect(result.current).toHaveProperty('initializeMockData')
    expect(result.current).toHaveProperty('addRoleAssignment')
    expect(result.current).toHaveProperty('updateRoleAssignment')
    expect(result.current).toHaveProperty('deleteRoleAssignment')

    expect(typeof result.current.initializeMockData).toBe('function')
    expect(typeof result.current.addRoleAssignment).toBe('function')
    expect(typeof result.current.updateRoleAssignment).toBe('function')
    expect(typeof result.current.deleteRoleAssignment).toBe('function')
  })
})
