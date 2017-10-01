/* @flow weak */
import React from 'react'
import ReactDOM from 'react-dom'
import { applyRouterMiddleware, browserHistory, Router } from 'react-router'
import useScroll from 'react-router-scroll/lib/useScroll'
import createRoutes from 'create-routes'
import { onRouteChange, onRouteUpdate } from 'gatsby-browser'

const loadContext = require('.gatsby-context')

function loadConfig (cb) {
  const stuff = require('config')

  if (module.hot) {
    module.hot.accept(stuff.id, () => cb())
  }
  return cb()
}

let currentLocation = null

browserHistory.listen((location) => {
  currentLocation = location
  if (onRouteChange) {
    console.warn('onRouteChange is now deprecated and will be removed in the next major Gatsby release (0.13). Please use onRouteUpdate instead. See the PR for more info (https://github.com/gatsbyjs/gatsby/pull/321).')
    onRouteChange(location)
  }
})

function onUpdate () {
  if (onRouteUpdate) {
    onRouteUpdate(currentLocation)
  }
  // 判断链接内是否有锚点，如果有，则跳转到锚点，覆盖react-router的行为
  const { hash } = window.location;
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}

function shouldUpdateScroll (prevRouterProps, { location: { pathname } }) {
  if (prevRouterProps) {
    const { location: { pathname: oldPathname } } = prevRouterProps
    if (oldPathname === pathname) {
      return false
    }
  }
  return true
}

let routes
loadConfig(() =>
  loadContext((pagesReq) => {
    const { pages } = require('config')

    if (!routes) {
      routes = createRoutes(pages, pagesReq)
    } else {
      createRoutes(pages, pagesReq)
    }

    ReactDOM.render(
      <Router
        history={browserHistory}
        routes={routes}
        render={applyRouterMiddleware(useScroll(shouldUpdateScroll))}
        onUpdate={onUpdate}
      />,
      typeof window !== 'undefined' ? document.getElementById('react-mount') : undefined)
  }),
)
