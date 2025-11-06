/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const PrivacyScannerViewModelContext = React.createContext();

export const PrivacyScannerViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <PrivacyScannerViewModelContext.Provider value={viewModel}>
      {children}
    </PrivacyScannerViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const usePrivacyScannerViewModel = () => React.useContext(PrivacyScannerViewModelContext);

/* HOC to inject store to any functional or class component */
export const withPrivacyScannerViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={usePrivacyScannerViewModel()} />;
};
