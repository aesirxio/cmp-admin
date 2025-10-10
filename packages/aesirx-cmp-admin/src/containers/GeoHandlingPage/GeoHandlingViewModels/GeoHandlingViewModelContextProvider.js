/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const GeoHandlingViewModelContext = React.createContext();

export const GeoHandlingViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <GeoHandlingViewModelContext.Provider value={viewModel}>
      {children}
    </GeoHandlingViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useGeoHandlingViewModel = () => React.useContext(GeoHandlingViewModelContext);

/* HOC to inject store to any functional or class component */
export const withGeoHandlingViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useGeoHandlingViewModel()} />;
};
