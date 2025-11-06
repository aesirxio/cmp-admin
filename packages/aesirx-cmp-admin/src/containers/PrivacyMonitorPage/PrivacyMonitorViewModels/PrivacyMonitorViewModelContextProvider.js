/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const PrivacyMonitorViewModelContext = React.createContext();

export const PrivacyMonitorViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <PrivacyMonitorViewModelContext.Provider value={viewModel}>
      {children}
    </PrivacyMonitorViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const usePrivacyMonitorViewModel = () => React.useContext(PrivacyMonitorViewModelContext);

/* HOC to inject store to any functional or class component */
export const withPrivacyMonitorViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={usePrivacyMonitorViewModel()} />;
};
