import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:14
 * @route '/dashboard'
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
* @see \App\Http\Controllers\DashboardController::uploadDocuments
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
export const uploadDocuments = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadDocuments.url(options),
    method: 'post',
})

uploadDocuments.definition = {
    methods: ["post"],
    url: '/dashboard/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::uploadDocuments
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
uploadDocuments.url = (options?: RouteQueryOptions) => {
    return uploadDocuments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::uploadDocuments
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
uploadDocuments.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadDocuments.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::uploadDocuments
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
    const uploadDocumentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadDocuments.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::uploadDocuments
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/documents'
 */
        uploadDocumentsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadDocuments.url(options),
            method: 'post',
        })
    
    uploadDocuments.form = uploadDocumentsForm
/**
* @see \App\Http\Controllers\DashboardController::storeJamaahMember
 * @see app/Http/Controllers/DashboardController.php:138
 * @route '/dashboard/members'
 */
export const storeJamaahMember = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeJamaahMember.url(options),
    method: 'post',
})

storeJamaahMember.definition = {
    methods: ["post"],
    url: '/dashboard/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeJamaahMember
 * @see app/Http/Controllers/DashboardController.php:138
 * @route '/dashboard/members'
 */
storeJamaahMember.url = (options?: RouteQueryOptions) => {
    return storeJamaahMember.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeJamaahMember
 * @see app/Http/Controllers/DashboardController.php:138
 * @route '/dashboard/members'
 */
storeJamaahMember.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeJamaahMember.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeJamaahMember
 * @see app/Http/Controllers/DashboardController.php:138
 * @route '/dashboard/members'
 */
    const storeJamaahMemberForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeJamaahMember.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeJamaahMember
 * @see app/Http/Controllers/DashboardController.php:138
 * @route '/dashboard/members'
 */
        storeJamaahMemberForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeJamaahMember.url(options),
            method: 'post',
        })
    
    storeJamaahMember.form = storeJamaahMemberForm
/**
* @see \App\Http\Controllers\DashboardController::updateJamaahMember
 * @see app/Http/Controllers/DashboardController.php:195
 * @route '/dashboard/members/{id}'
 */
export const updateJamaahMember = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateJamaahMember.url(args, options),
    method: 'put',
})

updateJamaahMember.definition = {
    methods: ["put"],
    url: '/dashboard/members/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DashboardController::updateJamaahMember
 * @see app/Http/Controllers/DashboardController.php:195
 * @route '/dashboard/members/{id}'
 */
updateJamaahMember.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateJamaahMember.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::updateJamaahMember
 * @see app/Http/Controllers/DashboardController.php:195
 * @route '/dashboard/members/{id}'
 */
updateJamaahMember.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateJamaahMember.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DashboardController::updateJamaahMember
 * @see app/Http/Controllers/DashboardController.php:195
 * @route '/dashboard/members/{id}'
 */
    const updateJamaahMemberForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateJamaahMember.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::updateJamaahMember
 * @see app/Http/Controllers/DashboardController.php:195
 * @route '/dashboard/members/{id}'
 */
        updateJamaahMemberForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateJamaahMember.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateJamaahMember.form = updateJamaahMemberForm
/**
* @see \App\Http\Controllers\DashboardController::uploadMemberDocument
 * @see app/Http/Controllers/DashboardController.php:227
 * @route '/dashboard/members/{id}/documents'
 */
export const uploadMemberDocument = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMemberDocument.url(args, options),
    method: 'post',
})

uploadMemberDocument.definition = {
    methods: ["post"],
    url: '/dashboard/members/{id}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::uploadMemberDocument
 * @see app/Http/Controllers/DashboardController.php:227
 * @route '/dashboard/members/{id}/documents'
 */
uploadMemberDocument.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return uploadMemberDocument.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::uploadMemberDocument
 * @see app/Http/Controllers/DashboardController.php:227
 * @route '/dashboard/members/{id}/documents'
 */
uploadMemberDocument.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMemberDocument.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::uploadMemberDocument
 * @see app/Http/Controllers/DashboardController.php:227
 * @route '/dashboard/members/{id}/documents'
 */
    const uploadMemberDocumentForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadMemberDocument.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::uploadMemberDocument
 * @see app/Http/Controllers/DashboardController.php:227
 * @route '/dashboard/members/{id}/documents'
 */
        uploadMemberDocumentForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadMemberDocument.url(args, options),
            method: 'post',
        })
    
    uploadMemberDocument.form = uploadMemberDocumentForm
/**
* @see \App\Http\Controllers\DashboardController::storeBooking
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/dashboard/bookings'
 */
export const storeBooking = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBooking.url(options),
    method: 'post',
})

storeBooking.definition = {
    methods: ["post"],
    url: '/dashboard/bookings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::storeBooking
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/dashboard/bookings'
 */
storeBooking.url = (options?: RouteQueryOptions) => {
    return storeBooking.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::storeBooking
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/dashboard/bookings'
 */
storeBooking.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBooking.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::storeBooking
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/dashboard/bookings'
 */
    const storeBookingForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeBooking.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::storeBooking
 * @see app/Http/Controllers/DashboardController.php:40
 * @route '/dashboard/bookings'
 */
        storeBookingForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeBooking.url(options),
            method: 'post',
        })
    
    storeBooking.form = storeBookingForm
const DashboardController = { index, uploadDocuments, storeJamaahMember, updateJamaahMember, uploadMemberDocument, storeBooking }

export default DashboardController