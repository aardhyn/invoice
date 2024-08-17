/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './route/__root'
import { Route as IndexImport } from './route/index'

// Create Virtual Routes

const BusinessLazyImport = createFileRoute('/business')()

// Create/Update Routes

const BusinessLazyRoute = BusinessLazyImport.update({
  path: '/business',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./route/business.lazy').then((d) => d.Route))

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/business': {
      id: '/business'
      path: '/business'
      fullPath: '/business'
      preLoaderRoute: typeof BusinessLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  BusinessLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/business"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/business": {
      "filePath": "business.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
