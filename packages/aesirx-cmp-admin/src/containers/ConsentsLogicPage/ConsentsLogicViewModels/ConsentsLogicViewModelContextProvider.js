/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const ConsentsLogicViewModelContext = React.createContext();

export const ConsentsLogicViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <ConsentsLogicViewModelContext.Provider value={viewModel}>
      {children}
    </ConsentsLogicViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useConsentsLogicViewModel = () => React.useContext(ConsentsLogicViewModelContext);

/* HOC to inject store to any functional or class component */
export const withConsentsLogicViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useConsentsLogicViewModel()} />;
};
