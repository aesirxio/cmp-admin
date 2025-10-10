/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const IDVerificationViewModelContext = React.createContext();

export const IDVerificationViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <IDVerificationViewModelContext.Provider value={viewModel}>
      {children}
    </IDVerificationViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useIDVerificationViewModel = () => React.useContext(IDVerificationViewModelContext);

/* HOC to inject store to any functional or class component */
export const withIDVerificationViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useIDVerificationViewModel()} />;
};
