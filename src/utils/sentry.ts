import { addBreadcrumb } from '@sentry/react-native';

const addInfoBreadcrumb = (message: any) =>
  addBreadcrumb({
    // @ts-expect-error ts-migrate(2322) FIXME: Type '"info"' is not assignable to type 'Severity ... Remove this comment to see the full error message
    level: 'info',
    message,
  });

const addDataBreadcrumb = (message: any, data: any) =>
  addBreadcrumb({
    data,
    // @ts-expect-error ts-migrate(2322) FIXME: Type '"info"' is not assignable to type 'Severity ... Remove this comment to see the full error message
    level: 'info',
    message,
  });

const addNavBreadcrumb = (prevRoute: any, nextRoute: any, data: any) =>
  addBreadcrumb({
    data,
    // @ts-expect-error ts-migrate(2322) FIXME: Type '"info"' is not assignable to type 'Severity ... Remove this comment to see the full error message
    level: 'info',
    message: `From ${prevRoute} to ${nextRoute}`,
  });

export default {
  addDataBreadcrumb,
  addInfoBreadcrumb,
  addNavBreadcrumb,
};
