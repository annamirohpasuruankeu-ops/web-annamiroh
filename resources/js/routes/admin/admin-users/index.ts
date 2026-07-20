import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/admin-users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminUserController::index
 * @see app/Http/Controllers/AdminUserController.php:15
 * @route '/admin/admin-users'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\AdminUserController::store
 * @see app/Http/Controllers/AdminUserController.php:30
 * @route '/admin/admin-users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/admin-users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminUserController::store
 * @see app/Http/Controllers/AdminUserController.php:30
 * @route '/admin/admin-users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminUserController::store
 * @see app/Http/Controllers/AdminUserController.php:30
 * @route '/admin/admin-users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminUserController::store
 * @see app/Http/Controllers/AdminUserController.php:30
 * @route '/admin/admin-users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminUserController::store
 * @see app/Http/Controllers/AdminUserController.php:30
 * @route '/admin/admin-users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AdminUserController::update
 * @see app/Http/Controllers/AdminUserController.php:49
 * @route '/admin/admin-users/{user}'
 */
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/admin-users/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminUserController::update
 * @see app/Http/Controllers/AdminUserController.php:49
 * @route '/admin/admin-users/{user}'
 */
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminUserController::update
 * @see app/Http/Controllers/AdminUserController.php:49
 * @route '/admin/admin-users/{user}'
 */
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminUserController::update
 * @see app/Http/Controllers/AdminUserController.php:49
 * @route '/admin/admin-users/{user}'
 */
    const updateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminUserController::update
 * @see app/Http/Controllers/AdminUserController.php:49
 * @route '/admin/admin-users/{user}'
 */
        updateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AdminUserController::toggle
 * @see app/Http/Controllers/AdminUserController.php:63
 * @route '/admin/admin-users/{user}/toggle'
 */
export const toggle = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/admin/admin-users/{user}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminUserController::toggle
 * @see app/Http/Controllers/AdminUserController.php:63
 * @route '/admin/admin-users/{user}/toggle'
 */
toggle.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return toggle.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminUserController::toggle
 * @see app/Http/Controllers/AdminUserController.php:63
 * @route '/admin/admin-users/{user}/toggle'
 */
toggle.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminUserController::toggle
 * @see app/Http/Controllers/AdminUserController.php:63
 * @route '/admin/admin-users/{user}/toggle'
 */
    const toggleForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminUserController::toggle
 * @see app/Http/Controllers/AdminUserController.php:63
 * @route '/admin/admin-users/{user}/toggle'
 */
        toggleForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggle.form = toggleForm
/**
* @see \App\Http\Controllers\AdminUserController::resetPassword
 * @see app/Http/Controllers/AdminUserController.php:72
 * @route '/admin/admin-users/{user}/reset-password'
 */
export const resetPassword = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resetPassword.url(args, options),
    method: 'patch',
})

resetPassword.definition = {
    methods: ["patch"],
    url: '/admin/admin-users/{user}/reset-password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminUserController::resetPassword
 * @see app/Http/Controllers/AdminUserController.php:72
 * @route '/admin/admin-users/{user}/reset-password'
 */
resetPassword.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return resetPassword.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminUserController::resetPassword
 * @see app/Http/Controllers/AdminUserController.php:72
 * @route '/admin/admin-users/{user}/reset-password'
 */
resetPassword.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resetPassword.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminUserController::resetPassword
 * @see app/Http/Controllers/AdminUserController.php:72
 * @route '/admin/admin-users/{user}/reset-password'
 */
    const resetPasswordForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resetPassword.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminUserController::resetPassword
 * @see app/Http/Controllers/AdminUserController.php:72
 * @route '/admin/admin-users/{user}/reset-password'
 */
        resetPasswordForm.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resetPassword.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    resetPassword.form = resetPasswordForm
const adminUsers = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
toggle: Object.assign(toggle, toggle),
resetPassword: Object.assign(resetPassword, resetPassword),
}

export default adminUsers