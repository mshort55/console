/* Copyright Contributors to the Open Cluster Management project */
import { RoleBindingHookType } from './RoleBindingHook'

const selectedNamespacesToRoleBinding = (roleBinding: RoleBindingHookType) =>
  roleBinding.namespaces.flatMap((ns) =>
    roleBinding.roleNames.map((role) => ({
      namespace: ns,
      roleRef: {
        name: role,
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'ClusterRole',
      },
      subjects: roleBinding.subjectNames.map((name) => ({
        name,
        apiGroup: 'rbac.authorization.k8s.io',
        kind: roleBinding.subjectKind,
      })),
    }))
  )

export { selectedNamespacesToRoleBinding }
