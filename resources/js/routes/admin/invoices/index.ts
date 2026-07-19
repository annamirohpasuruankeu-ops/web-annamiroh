import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:13
 * @route '/admin/invoices'
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
* @see \App\Http\Controllers\InvoiceController::importMethod
 * @see app/Http/Controllers/InvoiceController.php:111
 * @route '/admin/invoices/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/admin/invoices/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::importMethod
 * @see app/Http/Controllers/InvoiceController.php:111
 * @route '/admin/invoices/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::importMethod
 * @see app/Http/Controllers/InvoiceController.php:111
 * @route '/admin/invoices/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InvoiceController::importMethod
 * @see app/Http/Controllers/InvoiceController.php:111
 * @route '/admin/invoices/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InvoiceController::importMethod
 * @see app/Http/Controllers/InvoiceController.php:111
 * @route '/admin/invoices/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
const invoices = {
    index: Object.assign(index, index),
import: Object.assign(importMethod, importMethod),
}

export default invoices