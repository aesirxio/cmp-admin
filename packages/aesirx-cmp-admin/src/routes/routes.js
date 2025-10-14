/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy } from 'react';
import { LoginPage, ProfilePage } from 'aesirx-uikit';
import { env } from 'aesirx-lib';
const ConsentsPage = lazy(() => import('../containers/ConsentsPage'));
const ConsentsShieldPage = lazy(() => import('../containers/ConsentsShieldPage'));
const ConsentsTemplatePage = lazy(() => import('../containers/ConsentsTemplatePage'));
const ConsentsAdvancePage = lazy(() => import('../containers/ConsentsAdvancePage'));
const IDVerificationPage = lazy(() => import('../containers/IDVerificationPage'));
const ConsentsLogicPage = lazy(() => import('../containers/ConsentsLogicPage'));
const GeoHandlingPage = lazy(() => import('../containers/GeoHandlingPage'));
const AIAdvisorPage = lazy(() => import('../containers/AIAdvisorPage'));
const authRoutes = [
  {
    path: '/login',
    exact: true,
    main: () => <LoginPage text="BI" loginEmail={env.REACT_APP_LOGIN_EMAIL} />,
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
];

const settingRoutes = [
  {
    path: '/profile',
    exact: false,
    main: () => <ProfilePage />,
  },
];

export { authRoutes, mainRoutes, settingRoutes };
