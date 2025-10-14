/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const AIAdvisorViewModelContext = React.createContext();

export const AIAdvisorViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <AIAdvisorViewModelContext.Provider value={viewModel}>
      {children}
    </AIAdvisorViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useAIAdvisorViewModel = () => React.useContext(AIAdvisorViewModelContext);

/* HOC to inject store to any functional or class component */
export const withAIAdvisorViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useAIAdvisorViewModel()} />;
};
