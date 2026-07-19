import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
export const reguler = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reguler.url(options),
    method: 'get',
})

reguler.definition = {
    methods: ["get","head"],
    url: '/kategori-program/umroh-reguler',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
reguler.url = (options?: RouteQueryOptions) => {
    return reguler.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
reguler.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reguler.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
reguler.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reguler.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
    const regulerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reguler.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
        regulerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reguler.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicPackageController::reguler
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
        regulerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reguler.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reguler.form = regulerForm
const packages = {
    reguler: Object.assign(reguler, reguler),
}

export default packages