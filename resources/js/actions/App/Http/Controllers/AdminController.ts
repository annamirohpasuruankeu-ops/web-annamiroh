import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::index
 * @see app/Http/Controllers/AdminController.php:17
 * @route '/admin'
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
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
export const orders = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orders.url(options),
    method: 'get',
})

orders.definition = {
    methods: ["get","head"],
    url: '/admin/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
orders.url = (options?: RouteQueryOptions) => {
    return orders.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
orders.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orders.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
orders.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: orders.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
    const ordersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: orders.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
        ordersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: orders.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1561
 * @route '/admin/orders'
 */
        ordersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: orders.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    orders.form = ordersForm
/**
* @see \App\Http\Controllers\AdminController::storeOrder
 * @see app/Http/Controllers/AdminController.php:1652
 * @route '/admin/orders'
 */
export const storeOrder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrder.url(options),
    method: 'post',
})

storeOrder.definition = {
    methods: ["post"],
    url: '/admin/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeOrder
 * @see app/Http/Controllers/AdminController.php:1652
 * @route '/admin/orders'
 */
storeOrder.url = (options?: RouteQueryOptions) => {
    return storeOrder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeOrder
 * @see app/Http/Controllers/AdminController.php:1652
 * @route '/admin/orders'
 */
storeOrder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrder.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeOrder
 * @see app/Http/Controllers/AdminController.php:1652
 * @route '/admin/orders'
 */
    const storeOrderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeOrder.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeOrder
 * @see app/Http/Controllers/AdminController.php:1652
 * @route '/admin/orders'
 */
        storeOrderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeOrder.url(options),
            method: 'post',
        })
    
    storeOrder.form = storeOrderForm
/**
* @see \App\Http\Controllers\AdminController::updateOrder
 * @see app/Http/Controllers/AdminController.php:1681
 * @route '/admin/orders/{id}'
 */
export const updateOrder = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateOrder.url(args, options),
    method: 'put',
})

updateOrder.definition = {
    methods: ["put"],
    url: '/admin/orders/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updateOrder
 * @see app/Http/Controllers/AdminController.php:1681
 * @route '/admin/orders/{id}'
 */
updateOrder.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateOrder.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateOrder
 * @see app/Http/Controllers/AdminController.php:1681
 * @route '/admin/orders/{id}'
 */
updateOrder.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateOrder.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::updateOrder
 * @see app/Http/Controllers/AdminController.php:1681
 * @route '/admin/orders/{id}'
 */
    const updateOrderForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateOrder.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateOrder
 * @see app/Http/Controllers/AdminController.php:1681
 * @route '/admin/orders/{id}'
 */
        updateOrderForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateOrder.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateOrder.form = updateOrderForm
/**
* @see \App\Http\Controllers\AdminController::toggleOrderLock
 * @see app/Http/Controllers/AdminController.php:1735
 * @route '/admin/orders/{id}/toggle-lock'
 */
export const toggleOrderLock = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleOrderLock.url(args, options),
    method: 'patch',
})

toggleOrderLock.definition = {
    methods: ["patch"],
    url: '/admin/orders/{id}/toggle-lock',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::toggleOrderLock
 * @see app/Http/Controllers/AdminController.php:1735
 * @route '/admin/orders/{id}/toggle-lock'
 */
toggleOrderLock.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleOrderLock.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleOrderLock
 * @see app/Http/Controllers/AdminController.php:1735
 * @route '/admin/orders/{id}/toggle-lock'
 */
toggleOrderLock.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleOrderLock.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleOrderLock
 * @see app/Http/Controllers/AdminController.php:1735
 * @route '/admin/orders/{id}/toggle-lock'
 */
    const toggleOrderLockForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleOrderLock.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleOrderLock
 * @see app/Http/Controllers/AdminController.php:1735
 * @route '/admin/orders/{id}/toggle-lock'
 */
        toggleOrderLockForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleOrderLock.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleOrderLock.form = toggleOrderLockForm
/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
export const isiJamaah = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: isiJamaah.url(args, options),
    method: 'get',
})

isiJamaah.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{id}/isi-jamaah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
isiJamaah.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return isiJamaah.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
isiJamaah.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: isiJamaah.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
isiJamaah.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: isiJamaah.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
    const isiJamaahForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: isiJamaah.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
        isiJamaahForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: isiJamaah.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::isiJamaah
 * @see app/Http/Controllers/AdminController.php:1749
 * @route '/admin/orders/{id}/isi-jamaah'
 */
        isiJamaahForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: isiJamaah.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    isiJamaah.form = isiJamaahForm
/**
* @see \App\Http\Controllers\AdminController::saveJamaahGrid
 * @see app/Http/Controllers/AdminController.php:1822
 * @route '/admin/orders/{id}/save-jamaah'
 */
export const saveJamaahGrid = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveJamaahGrid.url(args, options),
    method: 'post',
})

saveJamaahGrid.definition = {
    methods: ["post"],
    url: '/admin/orders/{id}/save-jamaah',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::saveJamaahGrid
 * @see app/Http/Controllers/AdminController.php:1822
 * @route '/admin/orders/{id}/save-jamaah'
 */
saveJamaahGrid.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return saveJamaahGrid.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::saveJamaahGrid
 * @see app/Http/Controllers/AdminController.php:1822
 * @route '/admin/orders/{id}/save-jamaah'
 */
saveJamaahGrid.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveJamaahGrid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::saveJamaahGrid
 * @see app/Http/Controllers/AdminController.php:1822
 * @route '/admin/orders/{id}/save-jamaah'
 */
    const saveJamaahGridForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: saveJamaahGrid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::saveJamaahGrid
 * @see app/Http/Controllers/AdminController.php:1822
 * @route '/admin/orders/{id}/save-jamaah'
 */
        saveJamaahGridForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: saveJamaahGrid.url(args, options),
            method: 'post',
        })
    
    saveJamaahGrid.form = saveJamaahGridForm
/**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
export const packages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: packages.url(options),
    method: 'get',
})

packages.definition = {
    methods: ["get","head"],
    url: '/admin/packages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
packages.url = (options?: RouteQueryOptions) => {
    return packages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
packages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: packages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
packages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: packages.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
    const packagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: packages.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
        packagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: packages.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::packages
 * @see app/Http/Controllers/AdminController.php:101
 * @route '/admin/packages'
 */
        packagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: packages.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    packages.form = packagesForm
/**
* @see \App\Http\Controllers\AdminController::storePackage
 * @see app/Http/Controllers/AdminController.php:819
 * @route '/admin/packages'
 */
export const storePackage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePackage.url(options),
    method: 'post',
})

storePackage.definition = {
    methods: ["post"],
    url: '/admin/packages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storePackage
 * @see app/Http/Controllers/AdminController.php:819
 * @route '/admin/packages'
 */
storePackage.url = (options?: RouteQueryOptions) => {
    return storePackage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storePackage
 * @see app/Http/Controllers/AdminController.php:819
 * @route '/admin/packages'
 */
storePackage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePackage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storePackage
 * @see app/Http/Controllers/AdminController.php:819
 * @route '/admin/packages'
 */
    const storePackageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePackage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storePackage
 * @see app/Http/Controllers/AdminController.php:819
 * @route '/admin/packages'
 */
        storePackageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePackage.url(options),
            method: 'post',
        })
    
    storePackage.form = storePackageForm
/**
* @see \App\Http\Controllers\AdminController::updatePackage
 * @see app/Http/Controllers/AdminController.php:854
 * @route '/admin/packages/{id}'
 */
export const updatePackage = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePackage.url(args, options),
    method: 'put',
})

updatePackage.definition = {
    methods: ["put"],
    url: '/admin/packages/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updatePackage
 * @see app/Http/Controllers/AdminController.php:854
 * @route '/admin/packages/{id}'
 */
updatePackage.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePackage.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updatePackage
 * @see app/Http/Controllers/AdminController.php:854
 * @route '/admin/packages/{id}'
 */
updatePackage.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePackage.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::updatePackage
 * @see app/Http/Controllers/AdminController.php:854
 * @route '/admin/packages/{id}'
 */
    const updatePackageForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePackage.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updatePackage
 * @see app/Http/Controllers/AdminController.php:854
 * @route '/admin/packages/{id}'
 */
        updatePackageForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePackage.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePackage.form = updatePackageForm
/**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
export const agents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agents.url(options),
    method: 'get',
})

agents.definition = {
    methods: ["get","head"],
    url: '/admin/agents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
agents.url = (options?: RouteQueryOptions) => {
    return agents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
agents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
agents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
    const agentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
        agentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::agents
 * @see app/Http/Controllers/AdminController.php:623
 * @route '/admin/agents'
 */
        agentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    agents.form = agentsForm
/**
* @see \App\Http\Controllers\AdminController::storeAgent
 * @see app/Http/Controllers/AdminController.php:648
 * @route '/admin/agents'
 */
export const storeAgent = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAgent.url(options),
    method: 'post',
})

storeAgent.definition = {
    methods: ["post"],
    url: '/admin/agents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeAgent
 * @see app/Http/Controllers/AdminController.php:648
 * @route '/admin/agents'
 */
storeAgent.url = (options?: RouteQueryOptions) => {
    return storeAgent.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeAgent
 * @see app/Http/Controllers/AdminController.php:648
 * @route '/admin/agents'
 */
storeAgent.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeAgent.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeAgent
 * @see app/Http/Controllers/AdminController.php:648
 * @route '/admin/agents'
 */
    const storeAgentForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeAgent.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeAgent
 * @see app/Http/Controllers/AdminController.php:648
 * @route '/admin/agents'
 */
        storeAgentForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeAgent.url(options),
            method: 'post',
        })
    
    storeAgent.form = storeAgentForm
/**
* @see \App\Http\Controllers\AdminController::updateAgent
 * @see app/Http/Controllers/AdminController.php:770
 * @route '/admin/agents/{id}'
 */
export const updateAgent = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAgent.url(args, options),
    method: 'put',
})

updateAgent.definition = {
    methods: ["put"],
    url: '/admin/agents/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updateAgent
 * @see app/Http/Controllers/AdminController.php:770
 * @route '/admin/agents/{id}'
 */
updateAgent.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateAgent.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateAgent
 * @see app/Http/Controllers/AdminController.php:770
 * @route '/admin/agents/{id}'
 */
updateAgent.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAgent.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::updateAgent
 * @see app/Http/Controllers/AdminController.php:770
 * @route '/admin/agents/{id}'
 */
    const updateAgentForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateAgent.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateAgent
 * @see app/Http/Controllers/AdminController.php:770
 * @route '/admin/agents/{id}'
 */
        updateAgentForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateAgent.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateAgent.form = updateAgentForm
/**
* @see \App\Http\Controllers\AdminController::importAgents
 * @see app/Http/Controllers/AdminController.php:677
 * @route '/admin/agents/import'
 */
export const importAgents = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importAgents.url(options),
    method: 'post',
})

importAgents.definition = {
    methods: ["post"],
    url: '/admin/agents/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::importAgents
 * @see app/Http/Controllers/AdminController.php:677
 * @route '/admin/agents/import'
 */
importAgents.url = (options?: RouteQueryOptions) => {
    return importAgents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::importAgents
 * @see app/Http/Controllers/AdminController.php:677
 * @route '/admin/agents/import'
 */
importAgents.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importAgents.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::importAgents
 * @see app/Http/Controllers/AdminController.php:677
 * @route '/admin/agents/import'
 */
    const importAgentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importAgents.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::importAgents
 * @see app/Http/Controllers/AdminController.php:677
 * @route '/admin/agents/import'
 */
        importAgentsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importAgents.url(options),
            method: 'post',
        })
    
    importAgents.form = importAgentsForm
/**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
export const jamaah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jamaah.url(options),
    method: 'get',
})

jamaah.definition = {
    methods: ["get","head"],
    url: '/admin/jamaah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
jamaah.url = (options?: RouteQueryOptions) => {
    return jamaah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
jamaah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jamaah.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
jamaah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jamaah.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
    const jamaahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: jamaah.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
        jamaahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jamaah.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::jamaah
 * @see app/Http/Controllers/AdminController.php:124
 * @route '/admin/jamaah'
 */
        jamaahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jamaah.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    jamaah.form = jamaahForm
/**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
export const exportJamaah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportJamaah.url(options),
    method: 'get',
})

exportJamaah.definition = {
    methods: ["get","head"],
    url: '/admin/jamaah/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
exportJamaah.url = (options?: RouteQueryOptions) => {
    return exportJamaah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
exportJamaah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportJamaah.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
exportJamaah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportJamaah.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
    const exportJamaahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportJamaah.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
        exportJamaahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportJamaah.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::exportJamaah
 * @see app/Http/Controllers/AdminController.php:203
 * @route '/admin/jamaah/export'
 */
        exportJamaahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportJamaah.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportJamaah.form = exportJamaahForm
/**
* @see \App\Http\Controllers\AdminController::importJamaah
 * @see app/Http/Controllers/AdminController.php:2069
 * @route '/admin/jamaah/import'
 */
export const importJamaah = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importJamaah.url(options),
    method: 'post',
})

importJamaah.definition = {
    methods: ["post"],
    url: '/admin/jamaah/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::importJamaah
 * @see app/Http/Controllers/AdminController.php:2069
 * @route '/admin/jamaah/import'
 */
importJamaah.url = (options?: RouteQueryOptions) => {
    return importJamaah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::importJamaah
 * @see app/Http/Controllers/AdminController.php:2069
 * @route '/admin/jamaah/import'
 */
importJamaah.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importJamaah.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::importJamaah
 * @see app/Http/Controllers/AdminController.php:2069
 * @route '/admin/jamaah/import'
 */
    const importJamaahForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importJamaah.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::importJamaah
 * @see app/Http/Controllers/AdminController.php:2069
 * @route '/admin/jamaah/import'
 */
        importJamaahForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importJamaah.url(options),
            method: 'post',
        })
    
    importJamaah.form = importJamaahForm
/**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
export const jamaahDatabase = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jamaahDatabase.url(options),
    method: 'get',
})

jamaahDatabase.definition = {
    methods: ["get","head"],
    url: '/admin/jamaah-database',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
jamaahDatabase.url = (options?: RouteQueryOptions) => {
    return jamaahDatabase.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
jamaahDatabase.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jamaahDatabase.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
jamaahDatabase.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jamaahDatabase.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
    const jamaahDatabaseForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: jamaahDatabase.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
        jamaahDatabaseForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jamaahDatabase.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::jamaahDatabase
 * @see app/Http/Controllers/AdminController.php:388
 * @route '/admin/jamaah-database'
 */
        jamaahDatabaseForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jamaahDatabase.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    jamaahDatabase.form = jamaahDatabaseForm
/**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
export const manageMembers = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageMembers.url(args, options),
    method: 'get',
})

manageMembers.definition = {
    methods: ["get","head"],
    url: '/admin/jamaah/{id}/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
manageMembers.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return manageMembers.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
manageMembers.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageMembers.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
manageMembers.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageMembers.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
    const manageMembersForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manageMembers.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
        manageMembersForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageMembers.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::manageMembers
 * @see app/Http/Controllers/AdminController.php:441
 * @route '/admin/jamaah/{id}/members'
 */
        manageMembersForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manageMembers.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manageMembers.form = manageMembersForm
/**
* @see \App\Http\Controllers\AdminController::storeJamaah
 * @see app/Http/Controllers/AdminController.php:898
 * @route '/admin/jamaah'
 */
export const storeJamaah = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeJamaah.url(options),
    method: 'post',
})

storeJamaah.definition = {
    methods: ["post"],
    url: '/admin/jamaah',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeJamaah
 * @see app/Http/Controllers/AdminController.php:898
 * @route '/admin/jamaah'
 */
storeJamaah.url = (options?: RouteQueryOptions) => {
    return storeJamaah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeJamaah
 * @see app/Http/Controllers/AdminController.php:898
 * @route '/admin/jamaah'
 */
storeJamaah.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeJamaah.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeJamaah
 * @see app/Http/Controllers/AdminController.php:898
 * @route '/admin/jamaah'
 */
    const storeJamaahForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeJamaah.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeJamaah
 * @see app/Http/Controllers/AdminController.php:898
 * @route '/admin/jamaah'
 */
        storeJamaahForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeJamaah.url(options),
            method: 'post',
        })
    
    storeJamaah.form = storeJamaahForm
/**
* @see \App\Http\Controllers\AdminController::updateJamaah
 * @see app/Http/Controllers/AdminController.php:977
 * @route '/admin/jamaah/{id}'
 */
export const updateJamaah = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateJamaah.url(args, options),
    method: 'post',
})

updateJamaah.definition = {
    methods: ["post"],
    url: '/admin/jamaah/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::updateJamaah
 * @see app/Http/Controllers/AdminController.php:977
 * @route '/admin/jamaah/{id}'
 */
updateJamaah.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateJamaah.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateJamaah
 * @see app/Http/Controllers/AdminController.php:977
 * @route '/admin/jamaah/{id}'
 */
updateJamaah.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateJamaah.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::updateJamaah
 * @see app/Http/Controllers/AdminController.php:977
 * @route '/admin/jamaah/{id}'
 */
    const updateJamaahForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateJamaah.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateJamaah
 * @see app/Http/Controllers/AdminController.php:977
 * @route '/admin/jamaah/{id}'
 */
        updateJamaahForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateJamaah.url(args, options),
            method: 'post',
        })
    
    updateJamaah.form = updateJamaahForm
/**
* @see \App\Http\Controllers\AdminController::storeMember
 * @see app/Http/Controllers/AdminController.php:1044
 * @route '/admin/jamaah/{id}/members'
 */
export const storeMember = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMember.url(args, options),
    method: 'post',
})

storeMember.definition = {
    methods: ["post"],
    url: '/admin/jamaah/{id}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeMember
 * @see app/Http/Controllers/AdminController.php:1044
 * @route '/admin/jamaah/{id}/members'
 */
storeMember.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeMember.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeMember
 * @see app/Http/Controllers/AdminController.php:1044
 * @route '/admin/jamaah/{id}/members'
 */
storeMember.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMember.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeMember
 * @see app/Http/Controllers/AdminController.php:1044
 * @route '/admin/jamaah/{id}/members'
 */
    const storeMemberForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMember.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeMember
 * @see app/Http/Controllers/AdminController.php:1044
 * @route '/admin/jamaah/{id}/members'
 */
        storeMemberForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMember.url(args, options),
            method: 'post',
        })
    
    storeMember.form = storeMemberForm
/**
* @see \App\Http\Controllers\AdminController::uploadMemberDocument
 * @see app/Http/Controllers/AdminController.php:1078
 * @route '/admin/members/{id}/documents'
 */
export const uploadMemberDocument = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMemberDocument.url(args, options),
    method: 'post',
})

uploadMemberDocument.definition = {
    methods: ["post"],
    url: '/admin/members/{id}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::uploadMemberDocument
 * @see app/Http/Controllers/AdminController.php:1078
 * @route '/admin/members/{id}/documents'
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
* @see \App\Http\Controllers\AdminController::uploadMemberDocument
 * @see app/Http/Controllers/AdminController.php:1078
 * @route '/admin/members/{id}/documents'
 */
uploadMemberDocument.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMemberDocument.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::uploadMemberDocument
 * @see app/Http/Controllers/AdminController.php:1078
 * @route '/admin/members/{id}/documents'
 */
    const uploadMemberDocumentForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadMemberDocument.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::uploadMemberDocument
 * @see app/Http/Controllers/AdminController.php:1078
 * @route '/admin/members/{id}/documents'
 */
        uploadMemberDocumentForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadMemberDocument.url(args, options),
            method: 'post',
        })
    
    uploadMemberDocument.form = uploadMemberDocumentForm
/**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
export const bookings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookings.url(options),
    method: 'get',
})

bookings.definition = {
    methods: ["get","head"],
    url: '/admin/bookings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
bookings.url = (options?: RouteQueryOptions) => {
    return bookings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
bookings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
bookings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bookings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
    const bookingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bookings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
        bookingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bookings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::bookings
 * @see app/Http/Controllers/AdminController.php:458
 * @route '/admin/bookings'
 */
        bookingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bookings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bookings.form = bookingsForm
/**
* @see \App\Http\Controllers\AdminController::updateBooking
 * @see app/Http/Controllers/AdminController.php:517
 * @route '/admin/bookings/{id}'
 */
export const updateBooking = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateBooking.url(args, options),
    method: 'put',
})

updateBooking.definition = {
    methods: ["put"],
    url: '/admin/bookings/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updateBooking
 * @see app/Http/Controllers/AdminController.php:517
 * @route '/admin/bookings/{id}'
 */
updateBooking.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateBooking.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateBooking
 * @see app/Http/Controllers/AdminController.php:517
 * @route '/admin/bookings/{id}'
 */
updateBooking.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateBooking.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::updateBooking
 * @see app/Http/Controllers/AdminController.php:517
 * @route '/admin/bookings/{id}'
 */
    const updateBookingForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateBooking.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateBooking
 * @see app/Http/Controllers/AdminController.php:517
 * @route '/admin/bookings/{id}'
 */
        updateBookingForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateBooking.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateBooking.form = updateBookingForm
/**
* @see \App\Http\Controllers\AdminController::toggleBookingSeat
 * @see app/Http/Controllers/AdminController.php:1122
 * @route '/admin/bookings/{id}/toggle-seat'
 */
export const toggleBookingSeat = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleBookingSeat.url(args, options),
    method: 'patch',
})

toggleBookingSeat.definition = {
    methods: ["patch"],
    url: '/admin/bookings/{id}/toggle-seat',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::toggleBookingSeat
 * @see app/Http/Controllers/AdminController.php:1122
 * @route '/admin/bookings/{id}/toggle-seat'
 */
toggleBookingSeat.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleBookingSeat.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleBookingSeat
 * @see app/Http/Controllers/AdminController.php:1122
 * @route '/admin/bookings/{id}/toggle-seat'
 */
toggleBookingSeat.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleBookingSeat.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleBookingSeat
 * @see app/Http/Controllers/AdminController.php:1122
 * @route '/admin/bookings/{id}/toggle-seat'
 */
    const toggleBookingSeatForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleBookingSeat.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleBookingSeat
 * @see app/Http/Controllers/AdminController.php:1122
 * @route '/admin/bookings/{id}/toggle-seat'
 */
        toggleBookingSeatForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleBookingSeat.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleBookingSeat.form = toggleBookingSeatForm
/**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1143
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
 * @see app/Http/Controllers/AdminController.php:1143
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
 * @see app/Http/Controllers/AdminController.php:1143
 * @route '/admin/bookings/{id}/invoice'
 */
invoice.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1143
 * @route '/admin/bookings/{id}/invoice'
 */
invoice.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1143
 * @route '/admin/bookings/{id}/invoice'
 */
    const invoiceForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: invoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1143
 * @route '/admin/bookings/{id}/invoice'
 */
        invoiceForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::invoice
 * @see app/Http/Controllers/AdminController.php:1143
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
 * @see app/Http/Controllers/AdminController.php:1161
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
 * @see app/Http/Controllers/AdminController.php:1161
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
 * @see app/Http/Controllers/AdminController.php:1161
 * @route '/admin/bookings/{id}/registration-form'
 */
registrationForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: registrationForm.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1161
 * @route '/admin/bookings/{id}/registration-form'
 */
registrationForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: registrationForm.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1161
 * @route '/admin/bookings/{id}/registration-form'
 */
    const registrationFormForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: registrationForm.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1161
 * @route '/admin/bookings/{id}/registration-form'
 */
        registrationFormForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: registrationForm.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::registrationForm
 * @see app/Http/Controllers/AdminController.php:1161
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
* @see \App\Http\Controllers\AdminController::moveBookingPackage
 * @see app/Http/Controllers/AdminController.php:1917
 * @route '/admin/bookings/{id}/move-package'
 */
export const moveBookingPackage = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: moveBookingPackage.url(args, options),
    method: 'post',
})

moveBookingPackage.definition = {
    methods: ["post"],
    url: '/admin/bookings/{id}/move-package',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::moveBookingPackage
 * @see app/Http/Controllers/AdminController.php:1917
 * @route '/admin/bookings/{id}/move-package'
 */
moveBookingPackage.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return moveBookingPackage.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::moveBookingPackage
 * @see app/Http/Controllers/AdminController.php:1917
 * @route '/admin/bookings/{id}/move-package'
 */
moveBookingPackage.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: moveBookingPackage.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::moveBookingPackage
 * @see app/Http/Controllers/AdminController.php:1917
 * @route '/admin/bookings/{id}/move-package'
 */
    const moveBookingPackageForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: moveBookingPackage.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::moveBookingPackage
 * @see app/Http/Controllers/AdminController.php:1917
 * @route '/admin/bookings/{id}/move-package'
 */
        moveBookingPackageForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: moveBookingPackage.url(args, options),
            method: 'post',
        })
    
    moveBookingPackage.form = moveBookingPackageForm
/**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
export const searchJamaahMembers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchJamaahMembers.url(options),
    method: 'get',
})

searchJamaahMembers.definition = {
    methods: ["get","head"],
    url: '/admin/jamaah-members/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
searchJamaahMembers.url = (options?: RouteQueryOptions) => {
    return searchJamaahMembers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
searchJamaahMembers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchJamaahMembers.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
searchJamaahMembers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchJamaahMembers.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
    const searchJamaahMembersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchJamaahMembers.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
        searchJamaahMembersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchJamaahMembers.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::searchJamaahMembers
 * @see app/Http/Controllers/AdminController.php:2018
 * @route '/admin/jamaah-members/search'
 */
        searchJamaahMembersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchJamaahMembers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchJamaahMembers.form = searchJamaahMembersForm
/**
* @see \App\Http\Controllers\AdminController::assignJamaah
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
export const assignJamaah = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignJamaah.url(options),
    method: 'post',
})

assignJamaah.definition = {
    methods: ["post"],
    url: '/admin/assign-jamaah',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::assignJamaah
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
assignJamaah.url = (options?: RouteQueryOptions) => {
    return assignJamaah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::assignJamaah
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
assignJamaah.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignJamaah.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::assignJamaah
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
    const assignJamaahForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignJamaah.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::assignJamaah
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
        assignJamaahForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignJamaah.url(options),
            method: 'post',
        })
    
    assignJamaah.form = assignJamaahForm
/**
* @see \App\Http\Controllers\AdminController::removeJamaah
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
export const removeJamaah = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeJamaah.url(args, options),
    method: 'delete',
})

removeJamaah.definition = {
    methods: ["delete"],
    url: '/admin/remove-jamaah/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::removeJamaah
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
removeJamaah.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return removeJamaah.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::removeJamaah
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
removeJamaah.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeJamaah.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminController::removeJamaah
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
    const removeJamaahForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: removeJamaah.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::removeJamaah
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
        removeJamaahForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: removeJamaah.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    removeJamaah.form = removeJamaahForm
/**
* @see \App\Http\Controllers\AdminController::toggleUserStatus
 * @see app/Http/Controllers/AdminController.php:1103
 * @route '/admin/users/{id}/toggle-status'
 */
export const toggleUserStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleUserStatus.url(args, options),
    method: 'patch',
})

toggleUserStatus.definition = {
    methods: ["patch"],
    url: '/admin/users/{id}/toggle-status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::toggleUserStatus
 * @see app/Http/Controllers/AdminController.php:1103
 * @route '/admin/users/{id}/toggle-status'
 */
toggleUserStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleUserStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleUserStatus
 * @see app/Http/Controllers/AdminController.php:1103
 * @route '/admin/users/{id}/toggle-status'
 */
toggleUserStatus.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleUserStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleUserStatus
 * @see app/Http/Controllers/AdminController.php:1103
 * @route '/admin/users/{id}/toggle-status'
 */
    const toggleUserStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleUserStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleUserStatus
 * @see app/Http/Controllers/AdminController.php:1103
 * @route '/admin/users/{id}/toggle-status'
 */
        toggleUserStatusForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleUserStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleUserStatus.form = toggleUserStatusForm
/**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
export const financialReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: financialReport.url(options),
    method: 'get',
})

financialReport.definition = {
    methods: ["get","head"],
    url: '/admin/reports/financial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
financialReport.url = (options?: RouteQueryOptions) => {
    return financialReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
financialReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: financialReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
financialReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: financialReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
    const financialReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: financialReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
        financialReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: financialReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::financialReport
 * @see app/Http/Controllers/AdminController.php:1382
 * @route '/admin/reports/financial'
 */
        financialReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: financialReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    financialReport.form = financialReportForm
/**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
export const exportFinancialReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFinancialReport.url(options),
    method: 'get',
})

exportFinancialReport.definition = {
    methods: ["get","head"],
    url: '/admin/reports/financial/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
exportFinancialReport.url = (options?: RouteQueryOptions) => {
    return exportFinancialReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
exportFinancialReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFinancialReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
exportFinancialReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportFinancialReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
    const exportFinancialReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportFinancialReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
        exportFinancialReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportFinancialReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::exportFinancialReport
 * @see app/Http/Controllers/AdminController.php:1473
 * @route '/admin/reports/financial/export'
 */
        exportFinancialReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportFinancialReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportFinancialReport.form = exportFinancialReportForm
/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
export const popupPromos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: popupPromos.url(options),
    method: 'get',
})

popupPromos.definition = {
    methods: ["get","head"],
    url: '/admin/popup-promos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
popupPromos.url = (options?: RouteQueryOptions) => {
    return popupPromos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
popupPromos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: popupPromos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
popupPromos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: popupPromos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
    const popupPromosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: popupPromos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
        popupPromosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: popupPromos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1183
 * @route '/admin/popup-promos'
 */
        popupPromosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: popupPromos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    popupPromos.form = popupPromosForm
/**
* @see \App\Http\Controllers\AdminController::storePopupPromo
 * @see app/Http/Controllers/AdminController.php:1195
 * @route '/admin/popup-promos'
 */
export const storePopupPromo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePopupPromo.url(options),
    method: 'post',
})

storePopupPromo.definition = {
    methods: ["post"],
    url: '/admin/popup-promos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storePopupPromo
 * @see app/Http/Controllers/AdminController.php:1195
 * @route '/admin/popup-promos'
 */
storePopupPromo.url = (options?: RouteQueryOptions) => {
    return storePopupPromo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storePopupPromo
 * @see app/Http/Controllers/AdminController.php:1195
 * @route '/admin/popup-promos'
 */
storePopupPromo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePopupPromo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storePopupPromo
 * @see app/Http/Controllers/AdminController.php:1195
 * @route '/admin/popup-promos'
 */
    const storePopupPromoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePopupPromo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storePopupPromo
 * @see app/Http/Controllers/AdminController.php:1195
 * @route '/admin/popup-promos'
 */
        storePopupPromoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePopupPromo.url(options),
            method: 'post',
        })
    
    storePopupPromo.form = storePopupPromoForm
/**
* @see \App\Http\Controllers\AdminController::updatePopupPromo
 * @see app/Http/Controllers/AdminController.php:1226
 * @route '/admin/popup-promos/{id}'
 */
export const updatePopupPromo = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePopupPromo.url(args, options),
    method: 'put',
})

updatePopupPromo.definition = {
    methods: ["put"],
    url: '/admin/popup-promos/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updatePopupPromo
 * @see app/Http/Controllers/AdminController.php:1226
 * @route '/admin/popup-promos/{id}'
 */
updatePopupPromo.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updatePopupPromo.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updatePopupPromo
 * @see app/Http/Controllers/AdminController.php:1226
 * @route '/admin/popup-promos/{id}'
 */
updatePopupPromo.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePopupPromo.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::updatePopupPromo
 * @see app/Http/Controllers/AdminController.php:1226
 * @route '/admin/popup-promos/{id}'
 */
    const updatePopupPromoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePopupPromo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updatePopupPromo
 * @see app/Http/Controllers/AdminController.php:1226
 * @route '/admin/popup-promos/{id}'
 */
        updatePopupPromoForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePopupPromo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePopupPromo.form = updatePopupPromoForm
/**
* @see \App\Http\Controllers\AdminController::togglePopupPromo
 * @see app/Http/Controllers/AdminController.php:1264
 * @route '/admin/popup-promos/{id}/toggle'
 */
export const togglePopupPromo = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePopupPromo.url(args, options),
    method: 'patch',
})

togglePopupPromo.definition = {
    methods: ["patch"],
    url: '/admin/popup-promos/{id}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::togglePopupPromo
 * @see app/Http/Controllers/AdminController.php:1264
 * @route '/admin/popup-promos/{id}/toggle'
 */
togglePopupPromo.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return togglePopupPromo.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::togglePopupPromo
 * @see app/Http/Controllers/AdminController.php:1264
 * @route '/admin/popup-promos/{id}/toggle'
 */
togglePopupPromo.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: togglePopupPromo.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::togglePopupPromo
 * @see app/Http/Controllers/AdminController.php:1264
 * @route '/admin/popup-promos/{id}/toggle'
 */
    const togglePopupPromoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: togglePopupPromo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::togglePopupPromo
 * @see app/Http/Controllers/AdminController.php:1264
 * @route '/admin/popup-promos/{id}/toggle'
 */
        togglePopupPromoForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: togglePopupPromo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    togglePopupPromo.form = togglePopupPromoForm
/**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
export const galleries = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleries.url(options),
    method: 'get',
})

galleries.definition = {
    methods: ["get","head"],
    url: '/admin/galleries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
galleries.url = (options?: RouteQueryOptions) => {
    return galleries.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
galleries.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleries.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
galleries.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: galleries.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
    const galleriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: galleries.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
        galleriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: galleries.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1287
 * @route '/admin/galleries'
 */
        galleriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: galleries.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    galleries.form = galleriesForm
/**
* @see \App\Http\Controllers\AdminController::storeGallery
 * @see app/Http/Controllers/AdminController.php:1299
 * @route '/admin/galleries'
 */
export const storeGallery = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeGallery.url(options),
    method: 'post',
})

storeGallery.definition = {
    methods: ["post"],
    url: '/admin/galleries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::storeGallery
 * @see app/Http/Controllers/AdminController.php:1299
 * @route '/admin/galleries'
 */
storeGallery.url = (options?: RouteQueryOptions) => {
    return storeGallery.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::storeGallery
 * @see app/Http/Controllers/AdminController.php:1299
 * @route '/admin/galleries'
 */
storeGallery.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeGallery.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::storeGallery
 * @see app/Http/Controllers/AdminController.php:1299
 * @route '/admin/galleries'
 */
    const storeGalleryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeGallery.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::storeGallery
 * @see app/Http/Controllers/AdminController.php:1299
 * @route '/admin/galleries'
 */
        storeGalleryForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeGallery.url(options),
            method: 'post',
        })
    
    storeGallery.form = storeGalleryForm
/**
* @see \App\Http\Controllers\AdminController::updateGallery
 * @see app/Http/Controllers/AdminController.php:1323
 * @route '/admin/galleries/{id}'
 */
export const updateGallery = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateGallery.url(args, options),
    method: 'put',
})

updateGallery.definition = {
    methods: ["put"],
    url: '/admin/galleries/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AdminController::updateGallery
 * @see app/Http/Controllers/AdminController.php:1323
 * @route '/admin/galleries/{id}'
 */
updateGallery.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateGallery.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::updateGallery
 * @see app/Http/Controllers/AdminController.php:1323
 * @route '/admin/galleries/{id}'
 */
updateGallery.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateGallery.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AdminController::updateGallery
 * @see app/Http/Controllers/AdminController.php:1323
 * @route '/admin/galleries/{id}'
 */
    const updateGalleryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateGallery.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::updateGallery
 * @see app/Http/Controllers/AdminController.php:1323
 * @route '/admin/galleries/{id}'
 */
        updateGalleryForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateGallery.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateGallery.form = updateGalleryForm
/**
* @see \App\Http\Controllers\AdminController::toggleGallery
 * @see app/Http/Controllers/AdminController.php:1354
 * @route '/admin/galleries/{id}/toggle'
 */
export const toggleGallery = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleGallery.url(args, options),
    method: 'patch',
})

toggleGallery.definition = {
    methods: ["patch"],
    url: '/admin/galleries/{id}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AdminController::toggleGallery
 * @see app/Http/Controllers/AdminController.php:1354
 * @route '/admin/galleries/{id}/toggle'
 */
toggleGallery.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return toggleGallery.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::toggleGallery
 * @see app/Http/Controllers/AdminController.php:1354
 * @route '/admin/galleries/{id}/toggle'
 */
toggleGallery.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleGallery.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AdminController::toggleGallery
 * @see app/Http/Controllers/AdminController.php:1354
 * @route '/admin/galleries/{id}/toggle'
 */
    const toggleGalleryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleGallery.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::toggleGallery
 * @see app/Http/Controllers/AdminController.php:1354
 * @route '/admin/galleries/{id}/toggle'
 */
        toggleGalleryForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleGallery.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleGallery.form = toggleGalleryForm
/**
* @see \App\Http\Controllers\AdminController::destroyGallery
 * @see app/Http/Controllers/AdminController.php:1366
 * @route '/admin/galleries/{id}'
 */
export const destroyGallery = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyGallery.url(args, options),
    method: 'delete',
})

destroyGallery.definition = {
    methods: ["delete"],
    url: '/admin/galleries/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::destroyGallery
 * @see app/Http/Controllers/AdminController.php:1366
 * @route '/admin/galleries/{id}'
 */
destroyGallery.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroyGallery.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::destroyGallery
 * @see app/Http/Controllers/AdminController.php:1366
 * @route '/admin/galleries/{id}'
 */
destroyGallery.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyGallery.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminController::destroyGallery
 * @see app/Http/Controllers/AdminController.php:1366
 * @route '/admin/galleries/{id}'
 */
    const destroyGalleryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyGallery.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::destroyGallery
 * @see app/Http/Controllers/AdminController.php:1366
 * @route '/admin/galleries/{id}'
 */
        destroyGalleryForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyGallery.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyGallery.form = destroyGalleryForm
const AdminController = { index, orders, storeOrder, updateOrder, toggleOrderLock, isiJamaah, saveJamaahGrid, packages, storePackage, updatePackage, agents, storeAgent, updateAgent, importAgents, jamaah, exportJamaah, importJamaah, jamaahDatabase, manageMembers, storeJamaah, updateJamaah, storeMember, uploadMemberDocument, bookings, updateBooking, toggleBookingSeat, invoice, registrationForm, moveBookingPackage, searchJamaahMembers, assignJamaah, removeJamaah, toggleUserStatus, financialReport, exportFinancialReport, popupPromos, storePopupPromo, updatePopupPromo, togglePopupPromo, galleries, storeGallery, updateGallery, toggleGallery, destroyGallery }

export default AdminController