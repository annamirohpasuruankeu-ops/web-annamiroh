import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/recommendations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::index
 * @see app/Http/Controllers/RecommendationController.php:14
 * @route '/admin/recommendations'
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
* @see \App\Http\Controllers\RecommendationController::store
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/admin/recommendations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/recommendations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecommendationController::store
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/admin/recommendations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::store
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/admin/recommendations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecommendationController::store
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/admin/recommendations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::store
 * @see app/Http/Controllers/RecommendationController.php:88
 * @route '/admin/recommendations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RecommendationController::approve
 * @see app/Http/Controllers/RecommendationController.php:118
 * @route '/admin/recommendations/{id}/approve'
 */
export const approve = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/recommendations/{id}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecommendationController::approve
 * @see app/Http/Controllers/RecommendationController.php:118
 * @route '/admin/recommendations/{id}/approve'
 */
approve.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::approve
 * @see app/Http/Controllers/RecommendationController.php:118
 * @route '/admin/recommendations/{id}/approve'
 */
approve.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecommendationController::approve
 * @see app/Http/Controllers/RecommendationController.php:118
 * @route '/admin/recommendations/{id}/approve'
 */
    const approveForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::approve
 * @see app/Http/Controllers/RecommendationController.php:118
 * @route '/admin/recommendations/{id}/approve'
 */
        approveForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\RecommendationController::reject
 * @see app/Http/Controllers/RecommendationController.php:147
 * @route '/admin/recommendations/{id}/reject'
 */
export const reject = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/recommendations/{id}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecommendationController::reject
 * @see app/Http/Controllers/RecommendationController.php:147
 * @route '/admin/recommendations/{id}/reject'
 */
reject.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::reject
 * @see app/Http/Controllers/RecommendationController.php:147
 * @route '/admin/recommendations/{id}/reject'
 */
reject.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecommendationController::reject
 * @see app/Http/Controllers/RecommendationController.php:147
 * @route '/admin/recommendations/{id}/reject'
 */
    const rejectForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::reject
 * @see app/Http/Controllers/RecommendationController.php:147
 * @route '/admin/recommendations/{id}/reject'
 */
        rejectForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
export const searchJamaah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchJamaah.url(options),
    method: 'get',
})

searchJamaah.definition = {
    methods: ["get","head"],
    url: '/admin/recommendations/search-jamaah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
searchJamaah.url = (options?: RouteQueryOptions) => {
    return searchJamaah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
searchJamaah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchJamaah.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
searchJamaah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchJamaah.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
    const searchJamaahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchJamaah.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
        searchJamaahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchJamaah.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::searchJamaah
 * @see app/Http/Controllers/RecommendationController.php:172
 * @route '/admin/recommendations/search-jamaah'
 */
        searchJamaahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchJamaah.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchJamaah.form = searchJamaahForm
/**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
export const print = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/admin/recommendations/{id}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
print.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return print.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
print.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
print.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
    const printForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: print.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
        printForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecommendationController::print
 * @see app/Http/Controllers/RecommendationController.php:211
 * @route '/admin/recommendations/{id}/print'
 */
        printForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: print.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    print.form = printForm
const recommendations = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
searchJamaah: Object.assign(searchJamaah, searchJamaah),
print: Object.assign(print, print),
}

export default recommendations