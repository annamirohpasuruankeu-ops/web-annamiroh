import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
/**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
export const show = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/paket-umroh/{package}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
show.url = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{package}', parsedArgs.package.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
show.get = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
show.head = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
    const showForm = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
        showForm.get = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicPackageController::show
 * @see app/Http/Controllers/PublicPackageController.php:23
 * @route '/paket-umroh/{package}'
 */
        showForm.head = (args: { package: number | { id: number } } | [packageParam: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const packages = {
    reguler: Object.assign(reguler, reguler),
show: Object.assign(show, show),
}

export default packages