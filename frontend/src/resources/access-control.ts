/* Copyright Contributors to the Open Cluster Management project */
import { IResource, IResourceDefinition } from './resource'

export const AccessControlApiVersion = 'rbac.open-cluster-management.io/v1alpha1'
export type AccessControlApiVersionType = 'rbac.open-cluster-management.io/v1alpha1'

export const AccessControlKind = 'ClusterPermission'
export type AccessControlKindType = 'ClusterPermission'

export const AccessControlDefinition: IResourceDefinition = {
  apiVersion: AccessControlApiVersion,
  kind: AccessControlKind,
}

export interface Subject {
  apiGroup: string
  kind: 'User' | 'Group' | 'ServiceAccount'
  name: string
  namespace?: string
}

export interface RoleBinding {
  namespace: string
  roleRef: {
    apiGroup: string
    kind: 'Role'
    name: string
  }
  subject: {
    apiGroup: string
    kind: 'User' | 'Group'
    name: string
  }
}

export interface ClusterRoleBinding {
  name: string
  roleRef: {
    apiGroup: string
    kind: 'ClusterRole'
    name: string
  }
  subject?: Subject
  subjects?: Subject[]
}

export interface AccessControl extends IResource {
  apiVersion: AccessControlApiVersionType
  kind: AccessControlKindType
  spec: {
    roleBindings?: RoleBinding[]
    clusterRoleBinding?: ClusterRoleBinding
  }
}
