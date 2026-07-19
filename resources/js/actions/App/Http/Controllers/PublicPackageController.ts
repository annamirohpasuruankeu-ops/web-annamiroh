import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kategori-program/umroh-reguler',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicPackageController::index
 * @see app/Http/Controllers/PublicPackageController.php:11
 * @route '/kategori-program/umroh-reguler'
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
const PublicPackageController = { index }

export default PublicPackageController