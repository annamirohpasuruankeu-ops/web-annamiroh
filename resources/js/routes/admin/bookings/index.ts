import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:527
 * @route '/admin/bookings/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/bookings/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:527
 * @route '/admin/bookings/{id}'
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
 * @see app/Http/Controllers/AdminController.php:527
 * @route '/admin/bookings/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::update
 * @see app/Http/Controllers/AdminController.php:527
 * @route '/admin/bookings/{id}'
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
 * @see app/Http/Controllers/AdminController.php:527
 * @route '/admin/bookings/{id}'
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
* @see \App\Http\Controllers\AdminController::toggleSeat
 * @see app/Http/Controllers/AdminController.php:1283
 * @route '/admin/bookings/{id}/toggle-seat'
 */
export const toggleSeat = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleSeat.url(args, options),
    method: 'patch',
})

toggleSeat.definition = {
    methods: ["patch"],
    url: '/admin/bookings/{id}/toggle-seat',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::toggleSeat
 * @see app/Http/Controllers/AdminController.php:1283
 * @route '/admin/bookings/{id}/toggle-seat'
 */
toggleSeat.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleSeat.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleSeat
 * @see app/Http/Controllers/AdminController.php:1283
 * @route '/admin/bookings/{id}/toggle-seat'
 */
toggleSeat.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleSeat.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleSeat
 * @see app/Http/Controllers/AdminController.php:1283
 * @route '/admin/bookings/{id}/toggle-seat'
 */
    const toggleSeatForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleSeat.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleSeat
 * @see app/Http/Controllers/AdminController.php:1283
 * @route '/admin/bookings/{id}/toggle-seat'
 */
        toggleSeatForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleSeat.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleSeat.form = toggleSeatForm
/**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
export const invoice = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/admin/bookings/{id}/invoice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
invoice.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return invoice.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
invoice.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
invoice.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
    const invoiceForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: invoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
        invoiceForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1304
 * @route '/admin/bookings/{id}/invoice'
 */
        invoiceForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    invoice.form = invoiceForm
/**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
export const registrationForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registrationForm.url(args, options),
    method: 'get',
})

registrationForm.definition = {
    methods: ["get","head"],
    url: '/admin/bookings/{id}/registration-form',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
registrationForm.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return registrationForm.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
registrationForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registrationForm.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
registrationForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: registrationForm.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
    const registrationFormForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: registrationForm.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
        registrationFormForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: registrationForm.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1322
 * @route '/admin/bookings/{id}/registration-form'
 */
        registrationFormForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: registrationForm.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    registrationForm.form = registrationFormForm
/**
* @see \App\Http\Controllers\AdminController::movePackage
 * @see app/Http/Controllers/AdminController.php:2128
 * @route '/admin/bookings/{id}/move-package'
 */
export const movePackage = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: movePackage.url(args, options),
    method: 'post',
})

movePackage.definition = {
    methods: ["post"],
    url: '/admin/bookings/{id}/move-package',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::movePackage
 * @see app/Http/Controllers/AdminController.php:2128
 * @route '/admin/bookings/{id}/move-package'
 */
movePackage.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return movePackage.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::movePackage
 * @see app/Http/Controllers/AdminController.php:2128
 * @route '/admin/bookings/{id}/move-package'
 */
movePackage.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: movePackage.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::movePackage
 * @see app/Http/Controllers/AdminController.php:2128
 * @route '/admin/bookings/{id}/move-package'
 */
    const movePackageForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: movePackage.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::movePackage
 * @see app/Http/Controllers/AdminController.php:2128
 * @route '/admin/bookings/{id}/move-package'
 */
        movePackageForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: movePackage.url(args, options),
            method: 'post',
        })
    
    movePackage.form = movePackageForm
const bookings = {
    update: Object.assign(update, update),
toggleSeat: Object.assign(toggleSeat, toggleSeat),
invoice: Object.assign(invoice, invoice),
registrationForm: Object.assign(registrationForm, registrationForm),
movePackage: Object.assign(movePackage, movePackage),
}

export default bookings