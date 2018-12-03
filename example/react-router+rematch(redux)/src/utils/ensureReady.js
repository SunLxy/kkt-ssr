import { matchPath } from 'react-router-dom';

export async function ensureReady(routes, pathname) {
  await Promise.all(
    Object.keys(routes).map((path) => {
      const match = matchPath(pathname || window.location.pathname, {
        path, exact: routes[path].exact || false, strict: routes[path].strict || false,
      });
      if (match && path && routes[path] && routes[path].component && routes[path].component.getInitialProps) {
        // return routes[path].component.getInitialProps();
      }
      return undefined;
    })
  );

  let data;
  // eslint-disable-next-line
  if (typeof window !== undefined && !!document) {
    data = window._KKT_SSR;
  }
  return Promise.resolve(data);
}
