import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:1774
 * @route '/admin/orders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:1774
 * @route '/admin/orders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:1774
 * @route '/admin/orders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:1774
 * @route '/admin/orders'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:1774
 * @route '/admin/orders'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:1803
 * @route '/admin/orders/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/orders/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:1803
 * @route '/admin/orders/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:1803
 * @route '/admin/orders/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:1803
 * @route '/admin/orders/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:1803
 * @route '/admin/orders/{id}'
 */
        updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AdminController::toggleLock
 * @see app/Http/Controllers/AdminController.php:1857
 * @route '/admin/orders/{id}/toggle-lock'
 */
export const toggleLock = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleLock.url(args, options),
    method: 'patch',
})

toggleLock.definition = {
    methods: ["patch"],
    url: '/admin/orders/{id}/toggle-lock',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::toggleLock
 * @see app/Http/Controllers/AdminController.php:1857
 * @route '/admin/orders/{id}/toggle-lock'
 */
toggleLock.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return toggleLock.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleLock
 * @see app/Http/Controllers/AdminController.php:1857
 * @route '/admin/orders/{id}/toggle-lock'
 */
toggleLock.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleLock.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleLock
 * @see app/Http/Controllers/AdminController.php:1857
 * @route '/admin/orders/{id}/toggle-lock'
 */
    const toggleLockForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleLock.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleLock
 * @see app/Http/Controllers/AdminController.php:1857
 * @route '/admin/orders/{id}/toggle-lock'
 */
        toggleLockForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleLock.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleLock.form = toggleLockForm
/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
export const isiJamaah = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: isiJamaah.url(args, options),
    method: 'get',
})

isiJamaah.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{id}/isi-jamaah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
isiJamaah.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return isiJamaah.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
isiJamaah.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: isiJamaah.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
isiJamaah.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: isiJamaah.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
    const isiJamaahForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: isiJamaah.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
        isiJamaahForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: isiJamaah.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1871
 * @route '/admin/orders/{id}/isi-jamaah'
 */
        isiJamaahForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: isiJamaah.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    isiJamaah.form = isiJamaahForm
/**
* @see \App\Http\Controllers\AdminController::saveJamaah
 * @see app/Http/Controllers/AdminController.php:1944
 * @route '/admin/orders/{id}/save-jamaah'
 */
export const saveJamaah = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveJamaah.url(args, options),
    method: 'post',
})

saveJamaah.definition = {
    methods: ["post"],
    url: '/admin/orders/{id}/save-jamaah',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::saveJamaah
 * @see app/Http/Controllers/AdminController.php:1944
 * @route '/admin/orders/{id}/save-jamaah'
 */
saveJamaah.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return saveJamaah.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::saveJamaah
 * @see app/Http/Controllers/AdminController.php:1944
 * @route '/admin/orders/{id}/save-jamaah'
 */
saveJamaah.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveJamaah.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::saveJamaah
 * @see app/Http/Controllers/AdminController.php:1944
 * @route '/admin/orders/{id}/save-jamaah'
 */
    const saveJamaahForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveJamaah.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::saveJamaah
 * @see app/Http/Controllers/AdminController.php:1944
 * @route '/admin/orders/{id}/save-jamaah'
 */
        saveJamaahForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveJamaah.url(args, options),
            method: 'post',
        })
    
    saveJamaah.form = saveJamaahForm
const orders = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
toggleLock: Object.assign(toggleLock, toggleLock),
isiJamaah: Object.assign(isiJamaah, isiJamaah),
saveJamaah: Object.assign(saveJamaah, saveJamaah),
}

export default orders