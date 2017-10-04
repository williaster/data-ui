import ReactGA from 'react-ga';

const GA_ID = 'UA-102418724-1';

const isProd = () =>
  typeof window !== 'undefined' &&
  ['localhost', '0.0.0.0'].indexOf(window.location.hostname) === -1;

if (isProd()) {
  ReactGA.initialize(GA_ID);
  ReactGA.set({ page: window.location.pathname, title: 'data-ui' });
  ReactGA.pageview(window.location.pathname);
}

export function analytics({ story, kind, tab = 'demo' }) {
  if (isProd()) {
    ReactGA.set({
      page: window.location.pathname,
      title: `${kind} > ${story} > ${tab}`,
    });
    ReactGA.pageview(`?selectedKind=${kind}&selectedStory=${story}&tab=${tab}`);
  }
}

/*
 * Decorator that logs the current kind + story before calling the passed storyFn
 */
export default function GoogleAnalyticsDecorator(storyFn, { kind, story }) {
  analytics({ story, kind });
  return storyFn();
}
