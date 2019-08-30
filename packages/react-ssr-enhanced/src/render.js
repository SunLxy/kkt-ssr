import url from 'url';
import React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { matchPath, StaticRouter } from 'react-router-dom';
import { Document as DefaultDoc } from './Document';
import { loadInitialProps } from './loadInitialProps';
import RoutersController from './RoutersController';

export default async (options) => {
  const { req, res, routes, assets, document: Document, customRenderer, renderStatic, store, ...rest } = options;
  const Doc = Document || DefaultDoc;
  const context = rest.context || {};

  const { match, data } = await loadInitialProps(routes, url.parse(req.url).pathname, { req, res, store, ...rest });

  if (!match) {
    res.status(404);
    return;
  }
  if (match.path === '**') {
    res.status(404);
  } else if (match && match.redirectTo && match.path) {
    res.redirect(301, req.originalUrl.replace(match.path, match.redirectTo));
    return;
  }
  const renderPage = async () => {
    // By default, we keep ReactDOMServer synchronous renderToString function
    const defaultRenderer = element => ({ html: ReactDOMServer.renderToString(element) });
    const renderer = customRenderer || defaultRenderer;
    const asyncOrSyncRender = renderer(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <RoutersController store={store} routes={routes} data={data} />
        </StaticRouter>
      </Provider>
    );
    const renderedContent = await asyncOrSyncRender;
    const helmet = await Helmet.renderStatic();
    return { helmet, ...renderedContent };
  };
  const reactRouterMatch = matchPath(req.url, match);
  const { html, ...docProps } = await Doc.getInitialProps({
    req,
    res,
    assets,
    renderPage,
    data,
    store,
    helmet: Helmet.renderStatic(),
    match: reactRouterMatch,
    ...rest,
  });
  // Resolve there is a redirect in getInitialProps.
  if (/^(300|301|302|303|304|305|306|307)/.test(res.statusCode)) {
    return;
  }
  docProps.preloadAssets = { css: [], js: [] };
  if (reactRouterMatch && reactRouterMatch.path && routes) {
    const chunk = routes.find(item => item.path === reactRouterMatch.path);
    if (chunk && chunk.name) {
      const chunkAssets = Object.keys(assets).find(item => item === chunk.name);
      Object.keys(assets).forEach((name) => {
        if (name.indexOf(chunkAssets) > -1) {
          if (assets[name] && assets[name].css) {
            docProps.preloadAssets.css.push(assets[name].css);
          }
          if (assets[name] && assets[name].js) {
            docProps.preloadAssets.js.push(assets[name].js);
          }
        }
      });
    }
  }
  const doc = ReactDOMServer.renderToStaticMarkup(<Doc {...docProps} />);
  return `<!doctype html>${doc.replace('___SERVER_SSR_RENDER___', html)}`;
};
