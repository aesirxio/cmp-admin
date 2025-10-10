/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const ConsentsShieldViewModelContext = React.createContext();

export const ConsentsShieldViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <ConsentsShieldViewModelContext.Provider value={viewModel}>
      {children}
    </ConsentsShieldViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useConsentsShieldViewModel = () => React.useContext(ConsentsShieldViewModelContext);

/* HOC to inject store to any functional or class component */
export const withConsentsShieldViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useConsentsShieldViewModel()} />;
};
