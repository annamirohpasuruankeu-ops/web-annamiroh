import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
export const legacy = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(args, options),
    method: 'get',
})

legacy.definition = {
    methods: ["get","head"],
    url: '/download-file/{path}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
legacy.url = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    path: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        path: args.path,
                }

    return legacy.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
legacy.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: legacy.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
legacy.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: legacy.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
    const legacyForm = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: legacy.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
        legacyForm.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: legacy.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:46
 * @route '/download-file/{path}'
 */
        legacyForm.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: legacy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    legacy.form = legacyForm
const download = {
    legacy: Object.assign(legacy, legacy),
}

export default download