import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import financialA56e88 from './financial'
/**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
export const financial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: financial.url(options),
    method: 'get',
})

financial.definition = {
    methods: ["get","head"],
    url: '/admin/reports/financial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
financial.url = (options?: RouteQueryOptions) => {
    return financial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
financial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: financial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
financial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: financial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
    const financialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: financial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
        financialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: financial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::financial
 * @see app/Http/Controllers/AdminController.php:1504
 * @route '/admin/reports/financial'
 */
        financialForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: financial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    financial.form = financialForm
const reports = {
    financial: Object.assign(financial, financialA56e88),
}

export default reports