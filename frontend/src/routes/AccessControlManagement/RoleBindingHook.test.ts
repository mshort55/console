/* Copyright Contributors to the Open Cluster Management project */
import { renderHook, act } from '@testing-library/react-hooks'
import { useRoleBinding } from './RoleBindingHook'
import { RoleBinding, ClusterRoleBinding } from '../../resources/access-control'

describe('useRoleBinding', () => {
  describe('initial state', () => {
    test('should initialize with default values', () => {
      const { result } = renderHook(() => useRoleBinding())

      expect(result.current.roleBinding).toEqual({
        subjectKind: 'User',
        subjectNames: [],
        users: [],
        groups: [],
        roleNames: [],
        namespaces: [],
      })
      expect(result.current.isValid).toBe(false)
    })
  })

  describe('isValid validation', () => {
    test('should be false when both roleNames and subjectNames are empty', () => {
      const { result } = renderHook(() => useRoleBinding())
      expect(result.current.isValid).toBe(false)
    })

    test('should be false when only roleNames is provided', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setRoleNames(['admin'])
      })

      expect(result.current.isValid).toBe(false)
    })

    test('should be false when only subjectNames is provided', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectNames(['user1'])
      })

      expect(result.current.isValid).toBe(false)
    })

    test('should be true when both roleNames and subjectNames are provided', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setRoleNames(['admin'])
        result.current.setSubjectNames(['user1'])
      })

      expect(result.current.isValid).toBe(true)
    })

    test('should be true with multiple roleNames and subjectNames', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setRoleNames(['admin', 'editor'])
        result.current.setSubjectNames(['user1', 'user2'])
      })

      expect(result.current.isValid).toBe(true)
    })
  })

  describe('setSubjectKind', () => {
    test('should set subjectKind to User when value is "user"', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectKind('user')
      })

      expect(result.current.roleBinding.subjectKind).toBe('User')
    })

    test('should set subjectKind to Group when value is "group"', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectKind('group')
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
    })

    test('should default to User for any other value', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectKind('unknown')
      })

      expect(result.current.roleBinding.subjectKind).toBe('User')
    })

    test('should preserve user data when switching from User to Group', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectNames(['user1', 'user2'])
        result.current.setSubjectKind('group')
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
      expect(result.current.roleBinding.users).toEqual(['user1', 'user2'])
      expect(result.current.roleBinding.subjectNames).toEqual([])
    })

    test('should preserve group data when switching from Group to User', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectKind('group')
        result.current.setSubjectNames(['group1', 'group2'])
        result.current.setSubjectKind('user')
      })

      expect(result.current.roleBinding.subjectKind).toBe('User')
      expect(result.current.roleBinding.groups).toEqual(['group1', 'group2'])
      expect(result.current.roleBinding.subjectNames).toEqual([])
    })

    test('should restore user data when switching back to User', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectNames(['user1', 'user2'])
        result.current.setSubjectKind('group')
        result.current.setSubjectKind('user')
      })

      expect(result.current.roleBinding.subjectKind).toBe('User')
      expect(result.current.roleBinding.subjectNames).toEqual(['user1', 'user2'])
    })

    test('should restore group data when switching back to Group', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectKind('group')
        result.current.setSubjectNames(['group1', 'group2'])
        result.current.setSubjectKind('user')
        result.current.setSubjectKind('group')
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
      expect(result.current.roleBinding.subjectNames).toEqual(['group1', 'group2'])
    })
  })

  describe('setter functions', () => {
    test('setSubjectNames should update subjectNames', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectNames(['user1', 'user2'])
      })

      expect(result.current.roleBinding.subjectNames).toEqual(['user1', 'user2'])
    })

    test('setRoleNames should update roleNames', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setRoleNames(['admin', 'editor'])
      })

      expect(result.current.roleBinding.roleNames).toEqual(['admin', 'editor'])
    })

    test('setNamespaces should update namespaces', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setNamespaces(['default', 'kube-system'])
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default', 'kube-system'])
    })
  })

  describe('onRoleBindingChange with RoleBinding array', () => {
    test('should handle RoleBinding array with single subject', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user1',
          },
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default'])
      expect(result.current.roleBinding.subjectKind).toBe('User')
      expect(result.current.roleBinding.subjectNames).toEqual(['user1'])
      expect(result.current.roleBinding.roleNames).toEqual(['admin'])
      expect(result.current.roleBinding.users).toEqual(['user1'])
    })

    test('should handle RoleBinding array with subjects array', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subjects: [
            {
              apiGroup: 'rbac.authorization.k8s.io',
              kind: 'User',
              name: 'user1',
            },
            {
              apiGroup: 'rbac.authorization.k8s.io',
              kind: 'User',
              name: 'user2',
            },
          ],
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default'])
      expect(result.current.roleBinding.subjectKind).toBe('User')
      expect(result.current.roleBinding.subjectNames).toEqual(['user1', 'user2'])
      expect(result.current.roleBinding.roleNames).toEqual(['admin'])
      expect(result.current.roleBinding.users).toEqual(['user1', 'user2'])
    })

    test('should handle multiple RoleBindings with different namespaces', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user1',
          },
        },
        {
          namespace: 'kube-system',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'editor',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user2',
          },
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default', 'kube-system'])
      expect(result.current.roleBinding.subjectNames).toEqual(['user1', 'user2'])
      expect(result.current.roleBinding.roleNames).toEqual(['admin', 'editor'])
    })

    test('should deduplicate namespaces, subjects, and roles', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user1',
          },
        },
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user1',
          },
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default'])
      expect(result.current.roleBinding.subjectNames).toEqual(['user1'])
      expect(result.current.roleBinding.roleNames).toEqual(['admin'])
    })

    test('should handle Group subjects', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Group',
            name: 'group1',
          },
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
      expect(result.current.roleBinding.subjectNames).toEqual(['group1'])
      expect(result.current.roleBinding.groups).toEqual(['group1'])
    })

    test('should filter out RoleBindings without namespace', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user1',
          },
        },
        {
          namespace: '',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'editor',
          },
          subject: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user2',
          },
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default'])
    })
  })

  describe('onRoleBindingChange with ClusterRoleBinding', () => {
    test('should handle ClusterRoleBinding with single subject', () => {
      const { result } = renderHook(() => useRoleBinding())

      const clusterRoleBinding: ClusterRoleBinding = {
        name: 'cluster-admin-binding',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'cluster-admin',
        },
        subject: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'User',
          name: 'admin-user',
        },
      }

      act(() => {
        result.current.onRoleBindingChange(clusterRoleBinding)
      })

      expect(result.current.roleBinding.namespaces).toEqual([])
      expect(result.current.roleBinding.subjectKind).toBe('User')
      expect(result.current.roleBinding.subjectNames).toEqual(['admin-user'])
      expect(result.current.roleBinding.roleNames).toEqual(['cluster-admin'])
      expect(result.current.roleBinding.users).toEqual(['admin-user'])
    })

    test('should handle ClusterRoleBinding with subjects array', () => {
      const { result } = renderHook(() => useRoleBinding())

      const clusterRoleBinding: ClusterRoleBinding = {
        name: 'cluster-admin-binding',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'cluster-admin',
        },
        subjects: [
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'admin-user1',
          },
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'admin-user2',
          },
        ],
      }

      act(() => {
        result.current.onRoleBindingChange(clusterRoleBinding)
      })

      expect(result.current.roleBinding.subjectNames).toEqual(['admin-user1', 'admin-user2'])
      expect(result.current.roleBinding.roleNames).toEqual(['cluster-admin'])
    })

    test('should handle ClusterRoleBinding with subjects having namespaces', () => {
      const { result } = renderHook(() => useRoleBinding())

      const clusterRoleBinding: ClusterRoleBinding = {
        name: 'cluster-admin-binding',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'cluster-admin',
        },
        subjects: [
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'admin-user1',
            namespace: 'default',
          },
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'admin-user2',
            namespace: 'kube-system',
          },
        ],
      }

      act(() => {
        result.current.onRoleBindingChange(clusterRoleBinding)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default', 'kube-system'])
      expect(result.current.roleBinding.subjectNames).toEqual(['admin-user1', 'admin-user2'])
    })

    test('should handle ClusterRoleBinding with Group subjects', () => {
      const { result } = renderHook(() => useRoleBinding())

      const clusterRoleBinding: ClusterRoleBinding = {
        name: 'cluster-admin-binding',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'cluster-admin',
        },
        subject: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'Group',
          name: 'admin-group',
        },
      }

      act(() => {
        result.current.onRoleBindingChange(clusterRoleBinding)
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
      expect(result.current.roleBinding.subjectNames).toEqual(['admin-group'])
      expect(result.current.roleBinding.groups).toEqual(['admin-group'])
    })

    test('should handle ClusterRoleBinding without roleRef name', () => {
      const { result } = renderHook(() => useRoleBinding())

      const clusterRoleBinding: ClusterRoleBinding = {
        name: 'cluster-admin-binding',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: '',
        },
        subject: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'User',
          name: 'admin-user',
        },
      }

      act(() => {
        result.current.onRoleBindingChange(clusterRoleBinding)
      })

      expect(result.current.roleBinding.roleNames).toEqual([])
    })
  })

  describe('onRoleBindingChange edge cases', () => {
    test('should handle null/undefined input', () => {
      const { result } = renderHook(() => useRoleBinding())
      const initialState = { ...result.current.roleBinding }

      act(() => {
        result.current.onRoleBindingChange(null as any)
      })

      expect(result.current.roleBinding).toEqual(initialState)

      act(() => {
        result.current.onRoleBindingChange(undefined as any)
      })

      expect(result.current.roleBinding).toEqual(initialState)
    })

    test('should handle empty RoleBinding array', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.onRoleBindingChange([])
      })

      expect(result.current.roleBinding.namespaces).toEqual([])
      expect(result.current.roleBinding.subjectNames).toEqual([])
      expect(result.current.roleBinding.roleNames).toEqual([])
    })

    test('should preserve existing subjectKind when subjects are undefined', () => {
      const { result } = renderHook(() => useRoleBinding())

      act(() => {
        result.current.setSubjectKind('group')
      })

      const clusterRoleBinding: ClusterRoleBinding = {
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'cluster-admin',
        },
      }

      act(() => {
        result.current.onRoleBindingChange(clusterRoleBinding)
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
    })

    test('should handle RoleBinding without subjects or subject', () => {
      const { result } = renderHook(() => useRoleBinding())

      const roleBindings: RoleBinding[] = [
        {
          namespace: 'default',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'admin',
          },
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.namespaces).toEqual(['default'])
      expect(result.current.roleBinding.subjectNames).toEqual([])
      expect(result.current.roleBinding.roleNames).toEqual(['admin'])
    })
  })

  describe('integration scenarios', () => {
    test('should maintain validation state through various operations', () => {
      const { result } = renderHook(() => useRoleBinding())

      // Initially invalid
      expect(result.current.isValid).toBe(false)

      // Add role names - still invalid
      act(() => {
        result.current.setRoleNames(['admin'])
      })
      expect(result.current.isValid).toBe(false)

      // Add subject names - now valid
      act(() => {
        result.current.setSubjectNames(['user1'])
      })
      expect(result.current.isValid).toBe(true)

      // Switch subject kind - becomes invalid because subjectNames gets cleared
      act(() => {
        result.current.setSubjectKind('group')
      })
      expect(result.current.isValid).toBe(false)

      // Add group names - valid again
      act(() => {
        result.current.setSubjectNames(['group1'])
      })
      expect(result.current.isValid).toBe(true)

      // Clear role names - invalid
      act(() => {
        result.current.setRoleNames([])
      })
      expect(result.current.isValid).toBe(false)
    })

    test('should handle complex data flow with onRoleBindingChange', () => {
      const { result } = renderHook(() => useRoleBinding())

      // Set initial data
      act(() => {
        result.current.setSubjectNames(['initial-user'])
        result.current.setRoleNames(['initial-role'])
      })

      expect(result.current.roleBinding.subjectNames).toEqual(['initial-user'])
      expect(result.current.roleBinding.users).toEqual([]) // users array is not automatically populated by setSubjectNames
      expect(result.current.isValid).toBe(true)

      // Change data via onRoleBindingChange
      const roleBindings: RoleBinding[] = [
        {
          namespace: 'production',
          roleRef: {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'Role',
            name: 'production-admin',
          },
          subjects: [
            {
              apiGroup: 'rbac.authorization.k8s.io',
              kind: 'Group',
              name: 'production-team',
            },
          ],
        },
      ]

      act(() => {
        result.current.onRoleBindingChange(roleBindings)
      })

      expect(result.current.roleBinding.subjectKind).toBe('Group')
      expect(result.current.roleBinding.subjectNames).toEqual(['production-team'])
      expect(result.current.roleBinding.groups).toEqual(['production-team'])
      expect(result.current.roleBinding.users).toEqual([]) // users array was never populated since we only used setSubjectNames
      expect(result.current.roleBinding.roleNames).toEqual(['production-admin'])
      expect(result.current.roleBinding.namespaces).toEqual(['production'])
      expect(result.current.isValid).toBe(true)
    })
  })
})
