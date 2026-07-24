import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:661
 * @route '/admin/agents'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/agents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:661
 * @route '/admin/agents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:661
 * @route '/admin/agents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:661
 * @route '/admin/agents'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::store
 * @see app/Http/Controllers/AdminController.php:661
 * @route '/admin/agents'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:891
 * @route '/admin/agents/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/agents/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:891
 * @route '/admin/agents/{id}'
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
 * @see app/Http/Controllers/AdminController.php:891
 * @route '/admin/agents/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:891
 * @route '/admin/agents/{id}'
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
 * @see app/Http/Controllers/AdminController.php:891
 * @route '/admin/agents/{id}'
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
* @see \App\Http\Controllers\AdminController::importMethod
 * @see app/Http/Controllers/AdminController.php:698
 * @route '/admin/agents/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/admin/agents/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::importMethod
 * @see app/Http/Controllers/AdminController.php:698
 * @route '/admin/agents/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::importMethod
 * @see app/Http/Controllers/AdminController.php:698
 * @route '/admin/agents/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::importMethod
 * @see app/Http/Controllers/AdminController.php:698
 * @route '/admin/agents/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::importMethod
 * @see app/Http/Controllers/AdminController.php:698
 * @route '/admin/agents/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
export const importTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importTemplate.url(options),
    method: 'get',
})

importTemplate.definition = {
    methods: ["get","head"],
    url: '/admin/agents/import-template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
importTemplate.url = (options?: RouteQueryOptions) => {
    return importTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
importTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
importTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
    const importTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
        importTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::importTemplate
 * @see app/Http/Controllers/AdminController.php:867
 * @route '/admin/agents/import-template'
 */
        importTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importTemplate.form = importTemplateForm
const agents = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
import: Object.assign(importMethod, importMethod),
importTemplate: Object.assign(importTemplate, importTemplate),
}

export default agents