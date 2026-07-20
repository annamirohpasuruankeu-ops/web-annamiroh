import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:140
 * @route '/dashboard/members'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dashboard/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:140
 * @route '/dashboard/members'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:140
 * @route '/dashboard/members'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:140
 * @route '/dashboard/members'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::store
 * @see app/Http/Controllers/DashboardController.php:140
 * @route '/dashboard/members'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DashboardController::update
 * @see app/Http/Controllers/DashboardController.php:201
 * @route '/dashboard/members/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/dashboard/members/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DashboardController::update
 * @see app/Http/Controllers/DashboardController.php:201
 * @route '/dashboard/members/{id}'
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
* @see \App\Http\Controllers\DashboardController::update
 * @see app/Http/Controllers/DashboardController.php:201
 * @route '/dashboard/members/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DashboardController::update
 * @see app/Http/Controllers/DashboardController.php:201
 * @route '/dashboard/members/{id}'
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
* @see \App\Http\Controllers\DashboardController::update
 * @see app/Http/Controllers/DashboardController.php:201
 * @route '/dashboard/members/{id}'
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
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:234
 * @route '/dashboard/members/{id}/documents'
 */
export const documents = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: documents.url(args, options),
    method: 'post',
})

documents.definition = {
    methods: ["post"],
    url: '/dashboard/members/{id}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:234
 * @route '/dashboard/members/{id}/documents'
 */
documents.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return documents.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:234
 * @route '/dashboard/members/{id}/documents'
 */
documents.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: documents.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:234
 * @route '/dashboard/members/{id}/documents'
 */
    const documentsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: documents.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:234
 * @route '/dashboard/members/{id}/documents'
 */
        documentsForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: documents.url(args, options),
            method: 'post',
        })
    
    documents.form = documentsForm
const members = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
documents: Object.assign(documents, documents),
}

export default members