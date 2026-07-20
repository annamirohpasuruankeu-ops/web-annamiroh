import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::documents
 * @see app/Http/Controllers/AdminController.php:1194
 * @route '/admin/members/{id}/documents'
 */
export const documents = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: documents.url(args, options),
    method: 'post',
})

documents.definition = {
    methods: ["post"],
    url: '/admin/members/{id}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::documents
 * @see app/Http/Controllers/AdminController.php:1194
 * @route '/admin/members/{id}/documents'
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
* @see \App\Http\Controllers\AdminController::documents
 * @see app/Http/Controllers/AdminController.php:1194
 * @route '/admin/members/{id}/documents'
 */
documents.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: documents.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::documents
 * @see app/Http/Controllers/AdminController.php:1194
 * @route '/admin/members/{id}/documents'
 */
    const documentsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: documents.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::documents
 * @see app/Http/Controllers/AdminController.php:1194
 * @route '/admin/members/{id}/documents'
 */
        documentsForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: documents.url(args, options),
            method: 'post',
        })
    
    documents.form = documentsForm
const members = {
    documents: Object.assign(documents, documents),
}

export default members