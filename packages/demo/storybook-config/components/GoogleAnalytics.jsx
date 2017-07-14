import ReactGA from 'react-ga';

const GA_ID = 'UA-102418724-1';

if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  ReactGA.initialize(GA_ID);
  ReactGA.set({ page: window.location.pathname, title: 'data-ui' });
  ReactGA.pageview(window.location.pathname);
}

export const googleAnalytics = ReactGA;

/*
 * Decorator that logs the current kind + story before calling the passed storyFn
 */
export default function GoogleAnalyticsDecorator(storyFn, { kind, story }) {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    ReactGA.set({
      page: window.location.pathname,
      title: kind,
    });
    ReactGA.pageview(`?selectedKind=${kind}&selectedStory=${story}`);
  }
  return storyFn();
}
