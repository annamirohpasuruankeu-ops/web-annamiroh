import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/manifests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManifestFinalizationController::index
 * @see app/Http/Controllers/ManifestFinalizationController.php:14
 * @route '/admin/manifests'
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
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
export const download = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/admin/manifests/{package}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
download.url = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { package: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { package: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    package: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        package: typeof args.package === 'object'
                ? args.package.id
                : args.package,
                }

    return download.definition.url
            .replace('{package}', parsedArgs.package.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
download.get = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
download.head = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
    const downloadForm = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
        downloadForm.get = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManifestFinalizationController::download
 * @see app/Http/Controllers/ManifestFinalizationController.php:163
 * @route '/admin/manifests/{package}/download'
 */
        downloadForm.head = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\ManifestFinalizationController::lock
 * @see app/Http/Controllers/ManifestFinalizationController.php:87
 * @route '/admin/manifests/{package}/lock'
 */
export const lock = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(args, options),
    method: 'post',
})

lock.definition = {
    methods: ["post"],
    url: '/admin/manifests/{package}/lock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ManifestFinalizationController::lock
 * @see app/Http/Controllers/ManifestFinalizationController.php:87
 * @route '/admin/manifests/{package}/lock'
 */
lock.url = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { package: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { package: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    package: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        package: typeof args.package === 'object'
                ? args.package.id
                : args.package,
                }

    return lock.definition.url
            .replace('{package}', parsedArgs.package.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManifestFinalizationController::lock
 * @see app/Http/Controllers/ManifestFinalizationController.php:87
 * @route '/admin/manifests/{package}/lock'
 */
lock.post = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ManifestFinalizationController::lock
 * @see app/Http/Controllers/ManifestFinalizationController.php:87
 * @route '/admin/manifests/{package}/lock'
 */
    const lockForm = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: lock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManifestFinalizationController::lock
 * @see app/Http/Controllers/ManifestFinalizationController.php:87
 * @route '/admin/manifests/{package}/lock'
 */
        lockForm.post = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: lock.url(args, options),
            method: 'post',
        })
    
    lock.form = lockForm
/**
* @see \App\Http\Controllers\ManifestFinalizationController::unlock
 * @see app/Http/Controllers/ManifestFinalizationController.php:128
 * @route '/admin/manifests/{package}/unlock'
 */
export const unlock = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlock.url(args, options),
    method: 'post',
})

unlock.definition = {
    methods: ["post"],
    url: '/admin/manifests/{package}/unlock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ManifestFinalizationController::unlock
 * @see app/Http/Controllers/ManifestFinalizationController.php:128
 * @route '/admin/manifests/{package}/unlock'
 */
unlock.url = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { package: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { package: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    package: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        package: typeof args.package === 'object'
                ? args.package.id
                : args.package,
                }

    return unlock.definition.url
            .replace('{package}', parsedArgs.package.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManifestFinalizationController::unlock
 * @see app/Http/Controllers/ManifestFinalizationController.php:128
 * @route '/admin/manifests/{package}/unlock'
 */
unlock.post = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlock.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ManifestFinalizationController::unlock
 * @see app/Http/Controllers/ManifestFinalizationController.php:128
 * @route '/admin/manifests/{package}/unlock'
 */
    const unlockForm = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: unlock.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManifestFinalizationController::unlock
 * @see app/Http/Controllers/ManifestFinalizationController.php:128
 * @route '/admin/manifests/{package}/unlock'
 */
        unlockForm.post = (args: { package: string | number | { id: string | number } } | [packageParam: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: unlock.url(args, options),
            method: 'post',
        })
    
    unlock.form = unlockForm
const manifests = {
    index: Object.assign(index, index),
download: Object.assign(download, download),
lock: Object.assign(lock, lock),
unlock: Object.assign(unlock, unlock),
}

export default manifests