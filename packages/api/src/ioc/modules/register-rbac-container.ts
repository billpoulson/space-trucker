import { APP_ROLE_RESOLVER_FN$$, ApplicationRBAC, UserRBAC } from '@space-truckers/common'
import { Role, UserInfoObject } from '@space-truckers/types'
import { DependencyContainer } from 'tsyringe'

export function registerApplicationRBACContainerForRoot(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(ApplicationRBAC)
}

export function registerUserRBACContainer(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(UserRBAC)
        .register(APP_ROLE_RESOLVER_FN$$, {
            useFactory: (dep: DependencyContainer) => {
                return (tenant: string) => {
                    const userInfo = dep.resolve(UserInfoObject)
                    return Role.Admin
                }
            }
        })
}
