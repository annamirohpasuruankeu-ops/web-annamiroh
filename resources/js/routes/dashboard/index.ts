import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import members from './members'
import bookings from './bookings'
/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
export const documents = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: documents.url(options),
    method: 'post',
})

documents.definition = {
    methods: ["post"],
    url: '/dashboard/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
documents.url = (options?: RouteQueryOptions) => {
    return documents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
documents.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: documents.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
    const documentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: documents.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::documents
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
        documentsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: documents.url(options),
            method: 'post',
        })
    
    documents.form = documentsForm
const dashboard = {
    documents: Object.assign(documents, documents),
members: Object.assign(members, members),
bookings: Object.assign(bookings, bookings),
}

export default dashboard