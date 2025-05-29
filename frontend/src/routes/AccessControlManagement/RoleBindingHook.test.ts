import { act } from 'react-dom/test-utils'
import { ClusterRoleBinding, RoleBinding } from '../../resources/access-control'
import { renderHook } from '@testing-library/react-hooks'
import { useRoleBinding } from './RoleBindingHook'

describe('RoleBindingHook', () => {
  describe('useRoleBinding', () => {
    const initialRoleBindings: RoleBinding[] = [
      {
        namespace: 'ns1',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'Role',
          name: 'role1',
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
      {
        namespace: 'ns2',
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'Role',
          name: 'role2',
        },
        subjects: [
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user3',
          },
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: 'user4',
          },
        ],
      },
    ]

    const initialClusterRoleBinding: ClusterRoleBinding = {
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
        name: 'clusterrole1',
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
    }
    describe('onRoleBindingChange', () => {
      describe.each([
        {
          name: 'update RoleBindings',
          roleBinding: initialRoleBindings,
        },
        {
          name: 'update ClusterRoleBinding',
          roleBinding: initialClusterRoleBinding,
        },
      ])('$name', ({ roleBinding }) => {
        const { result } = renderHook(() => useRoleBinding())
        let expectedSubjectKind: 'User' | 'Group' | undefined
        let expectedSubjectNames: string[]

        act(() => {
          result.current.onRoleBindingChange(roleBinding)
        })

        it('should update role names as expected', () => {
          const expectedRoleNames = Array.isArray(roleBinding)
            ? roleBinding.map((rb) => rb.roleRef.name)
            : [roleBinding.roleRef.name]
          expect(result.current.roleBinding.roleNames).toEqual(expectedRoleNames)
        })

        it('should update namespaces as expected', () => {
          const expectedNamespaces = Array.isArray(roleBinding)
            ? [...new Set(roleBinding.filter((rb) => rb.namespace).map((rb) => rb.namespace))]
            : []
          expect(result.current.roleBinding.namespaces).toEqual(expectedNamespaces)
        })

        it('should update subject kind as expected', () => {
          expectedSubjectKind = Array.isArray(roleBinding)
            ? roleBinding[0]?.subjects?.[0].kind
            : roleBinding?.subjects?.[0].kind
          expect(result.current.roleBinding.subjectKind).toEqual(expectedSubjectKind)
        })

        it('should update subject names as expected', () => {
          expectedSubjectNames = Array.isArray(roleBinding)
            ? [...new Set(roleBinding.flatMap((rb) => rb.subjects?.map((s) => s.name) ?? []))]
            : [...new Set(roleBinding.subjects?.map((s) => s.name) ?? [])]
          expect(result.current.roleBinding.subjectNames).toEqual(expectedSubjectNames)
        })

        it('should update users and groups as expected', () => {
          const expectedUsers = expectedSubjectKind === 'User' ? expectedSubjectNames : []
          const expectedGroups = expectedSubjectKind === 'Group' ? expectedSubjectNames : []
          expect(result.current.roleBinding.users).toEqual(expectedUsers)
          expect(result.current.roleBinding.groups).toEqual(expectedGroups)
        })
      })
    })

    describe('isValid', () => {
      describe.each([
        {
          name: 'validate RoleBindings',
          roleBinding: initialRoleBindings,
        },
        {
          name: 'validate ClusterRoleBinding',
          roleBinding: initialClusterRoleBinding,
        },
      ])('$name', ({ roleBinding }) => {
        let result: any

        beforeEach(() => {
          const hookResult = renderHook(() => useRoleBinding())
          result = hookResult.result
          act(() => {
            result.current.onRoleBindingChange(roleBinding)
          })
        })

        it('should be invalid when role names are empty', () => {
          act(() => {
            result.current.setRoleNames([])
          })
          expect(result.current.isValid).toBe(false)
        })

        it('should be invalid when subject names are empty', () => {
          act(() => {
            result.current.setSubjectNames([])
          })
          expect(result.current.isValid).toBe(false)
        })

        it('should be valid when subject kind is empty because it defaults to User', () => {
          act(() => {
            result.current.setSubjectKind('')
          })
          expect(result.current.isValid).toBe(true)
        })

        it('should be valid when all required data is loaded', () => {
          expect(result.current.isValid).toBe(true)
        })
      })
    })

    describe('setSubjectKind and setSubjectNames', () => {
      describe.each([
        {
          name: 'set subjects for RoleBindings',
          roleBinding: initialRoleBindings,
        },
        {
          name: 'set subjects for ClusterRoleBinding',
          roleBinding: initialClusterRoleBinding,
        },
      ])('$name', ({ roleBinding }) => {
        let result: any

        beforeEach(() => {
          const hookResult = renderHook(() => useRoleBinding())
          result = hookResult.result
          act(() => {
            result.current.onRoleBindingChange(roleBinding)
          })
        })

        it('should update subject names as expected', () => {
          const expectedSubjectNames = ['newuser1', 'newuser2']
          act(() => {
            result.current.setSubjectNames(expectedSubjectNames)
          })
          expect(result.current.roleBinding.subjectNames).toEqual(expectedSubjectNames)
        })

        it('should update subject kind as expected', () => {
          const expectedSubjectKind = 'Group'
          act(() => {
            result.current.setSubjectKind(expectedSubjectKind)
          })
          expect(result.current.roleBinding.subjectKind).toEqual(expectedSubjectKind)
        })

        it('should keep users and groups state when switching between User and Group subject kinds', () => {
          const expectedGroups = ['group1', 'group2']
          const expectedUsers = Array.isArray(roleBinding)
            ? [...new Set(roleBinding.flatMap((rb) => rb.subjects?.map((s) => s.name) ?? []))]
            : [...new Set(roleBinding.subjects?.map((s) => s.name) ?? [])]
          act(() => {
            result.current.setSubjectKind('group')
            result.current.setSubjectNames(expectedGroups)
            result.current.setSubjectKind('user')
          })
          expect(result.current.roleBinding.subjectKind).toBe('User')
          expect(result.current.roleBinding.subjectNames).toEqual(expectedUsers)
          expect(result.current.roleBinding.users).toEqual(expectedUsers)
          expect(result.current.roleBinding.groups).toEqual(expectedGroups)
        })
      })
    })

    describe('setNamespaces', () => {
      describe.each([
        {
          name: 'set namespaces for RoleBindings',
          roleBinding: initialRoleBindings,
          expectedNamespaces: ['newns1', 'newns2'],
        },
        {
          name: 'set namespaces for ClusterRoleBinding (none)',
          roleBinding: initialClusterRoleBinding,
          expectedNamespaces: [],
        },
      ])('$name', ({ roleBinding, expectedNamespaces }) => {
        let result: any

        beforeEach(() => {
          const hookResult = renderHook(() => useRoleBinding())
          result = hookResult.result
          act(() => {
            result.current.onRoleBindingChange(roleBinding)
          })
        })

        it('should update namespaces as expected', () => {
          act(() => {
            result.current.setNamespaces(expectedNamespaces)
          })
          expect(result.current.roleBinding.namespaces).toEqual(expectedNamespaces)
        })
      })
    })

    describe('setRoleNames', () => {
      describe.each([
        {
          name: 'set role names for RoleBindings',
          roleBinding: initialRoleBindings,
          expectedRoleNames: ['newrole1', 'newrole1'],
        },
        {
          name: 'set role name for ClusterRoleBinding',
          roleBinding: initialClusterRoleBinding,
          expectedRoleNames: ['newclusterrole1'],
        },
      ])('$name', ({ roleBinding, expectedRoleNames }) => {
        let result: any

        beforeEach(() => {
          const hookResult = renderHook(() => useRoleBinding())
          result = hookResult.result
          act(() => {
            result.current.onRoleBindingChange(roleBinding)
          })
        })

        it('should update role names as expected', () => {
          act(() => {
            result.current.setRoleNames(expectedRoleNames)
          })
          expect(result.current.roleBinding.roleNames).toEqual(expectedRoleNames)
        })
      })
    })
  })
})
