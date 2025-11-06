/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy } from 'react';
import { history, LoginPage, ProfilePage } from 'aesirx-uikit';
import { env } from 'aesirx-lib';
const ConsentsPage = lazy(() => import('../containers/ConsentsPage'));
const ConsentsShieldPage = lazy(() => import('../containers/ConsentsShieldPage'));
const ConsentsTemplatePage = lazy(() => import('../containers/ConsentsTemplatePage'));
const ConsentsAdvancePage = lazy(() => import('../containers/ConsentsAdvancePage'));
const IDVerificationPage = lazy(() => import('../containers/IDVerificationPage'));
const ConsentsLogicPage = lazy(() => import('../containers/ConsentsLogicPage'));
const GeoHandlingPage = lazy(() => import('../containers/GeoHandlingPage'));
const AIAdvisorPage = lazy(() => import('../containers/AIAdvisorPage'));
const UserPage = lazy(() => import('../containers/UserPage'));
const PrivacyScannerPage = lazy(() => import('../containers/PrivacyScannerPage'));
const PrivacyMonitorPage = lazy(() => import('../containers/PrivacyMonitorPage'));
const EditUserProvider = lazy(() => import('../containers/UserPage/edit'));
const authRoutes = [
  {
    path: '/login',
    exact: true,
    main: () => <LoginPage text="CMP Admin" loginEmail={env.REACT_APP_LOGIN_EMAIL} />,
  },
];

const mainRoutes = [
  {
    path: ['/'],
    exact: true,
    main: () => <ConsentsShieldPage />,
  },
  {
    path: ['/consents'],
    exact: true,
    main: () => <ConsentsPage />,
  },
  {
    path: ['/consent-template'],
    exact: true,
    main: () => <ConsentsTemplatePage />,
  },
  {
    path: ['/id-verification'],
    exact: true,
    main: () => <IDVerificationPage />,
  },
  {
    path: ['/consent-logic'],
    exact: true,
    main: () => <ConsentsLogicPage />,
  },
  {
    path: ['/geo-handling'],
    exact: true,
    main: () => <GeoHandlingPage />,
  },
  {
    path: ['/consent-advance'],
    exact: true,
    main: () => <ConsentsAdvancePage />,
  },
  {
    path: ['/ai-advisor'],
    exact: true,
    main: () => <AIAdvisorPage />,
  },
  {
    path: ['/user-handling'],
    exact: true,
    main: () => <UserPage />,
  },
  {
    path: ['/user-handling/edit/:id'],
    exact: true,
    main: ({ match }) => <EditUserProvider match={match} />,
  },
  {
    path: ['/user-handling/add'],
    exact: true,
    main: () => <EditUserProvider />,
  },
  {
    path: ['/privacy-scanner'],
    exact: true,
    main: () => <PrivacyScannerPage />,
  },
  {
    path: ['/privacy-monitor'],
    exact: true,
    main: () => <PrivacyMonitorPage />,
  },
];

const settingRoutes = [
  {
    path: '/profile',
    exact: false,
    main: () => <ProfilePage />,
  },
];
const historyPush = (link) => {
  return history.push('' + link);
};

export { authRoutes, mainRoutes, settingRoutes, historyPush };
