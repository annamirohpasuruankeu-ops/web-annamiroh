import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import ordersB47e5f from './orders'
import packages418416 from './packages'
import agentsFfbb41 from './agents'
import jamaah305fb2 from './jamaah'
import members from './members'
import bookings743b13 from './bookings'
import jamaahMembers from './jamaah-members'
import users from './users'
import reports from './reports'
import finance from './finance'
import invoices from './invoices'
import popupPromosC363fd from './popup-promos'
import galleries6fe4c2 from './galleries'
import recommendations from './recommendations'
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
 * @see app/Http/Controllers/AdminController.php:1567
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
 * @see app/Http/Controllers/AdminController.php:1567
 * @route '/admin/orders'
 */
orders.url = (options?: RouteQueryOptions) => {
    return orders.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1567
 * @route '/admin/orders'
 */
orders.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: orders.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1567
 * @route '/admin/orders'
 */
orders.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: orders.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1567
 * @route '/admin/orders'
 */
    const ordersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: orders.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1567
 * @route '/admin/orders'
 */
        ordersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: orders.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::orders
 * @see app/Http/Controllers/AdminController.php:1567
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
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
export const assign = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(options),
    method: 'post',
})

assign.definition = {
    methods: ["post"],
    url: '/admin/assign-jamaah',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
assign.url = (options?: RouteQueryOptions) => {
    return assign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
assign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
    const assignForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assign.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::assign
 * @see app/Http/Controllers/AdminController.php:558
 * @route '/admin/assign-jamaah'
 */
        assignForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assign.url(options),
            method: 'post',
        })
    
    assign.form = assignForm
/**
* @see \App\Http\Controllers\AdminController::remove
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
export const remove = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/admin/remove-jamaah/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::remove
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
remove.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return remove.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::remove
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
remove.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AdminController::remove
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
    const removeForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: remove.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AdminController::remove
 * @see app/Http/Controllers/AdminController.php:807
 * @route '/admin/remove-jamaah/{id}'
 */
        removeForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: remove.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    remove.form = removeForm
/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1189
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
 * @see app/Http/Controllers/AdminController.php:1189
 * @route '/admin/popup-promos'
 */
popupPromos.url = (options?: RouteQueryOptions) => {
    return popupPromos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1189
 * @route '/admin/popup-promos'
 */
popupPromos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: popupPromos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1189
 * @route '/admin/popup-promos'
 */
popupPromos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: popupPromos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1189
 * @route '/admin/popup-promos'
 */
    const popupPromosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: popupPromos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1189
 * @route '/admin/popup-promos'
 */
        popupPromosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: popupPromos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::popupPromos
 * @see app/Http/Controllers/AdminController.php:1189
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
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1293
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
 * @see app/Http/Controllers/AdminController.php:1293
 * @route '/admin/galleries'
 */
galleries.url = (options?: RouteQueryOptions) => {
    return galleries.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1293
 * @route '/admin/galleries'
 */
galleries.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleries.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1293
 * @route '/admin/galleries'
 */
galleries.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: galleries.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1293
 * @route '/admin/galleries'
 */
    const galleriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: galleries.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1293
 * @route '/admin/galleries'
 */
        galleriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: galleries.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AdminController::galleries
 * @see app/Http/Controllers/AdminController.php:1293
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
const admin = {
    index: Object.assign(index, index),
orders: Object.assign(orders, ordersB47e5f),
packages: Object.assign(packages, packages418416),
agents: Object.assign(agents, agentsFfbb41),
jamaah: Object.assign(jamaah, jamaah305fb2),
jamaahDatabase: Object.assign(jamaahDatabase, jamaahDatabase),
members: Object.assign(members, members),
bookings: Object.assign(bookings, bookings743b13),
jamaahMembers: Object.assign(jamaahMembers, jamaahMembers),
assign: Object.assign(assign, assign),
remove: Object.assign(remove, remove),
users: Object.assign(users, users),
reports: Object.assign(reports, reports),
finance: Object.assign(finance, finance),
invoices: Object.assign(invoices, invoices),
popupPromos: Object.assign(popupPromos, popupPromosC363fd),
galleries: Object.assign(galleries, galleries6fe4c2),
recommendations: Object.assign(recommendations, recommendations),
}

export default admin