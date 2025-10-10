/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import GeoHandlingListViewModel from './GeoHandlingListViewModel';

class GeoHandlingViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new GeoHandlingListViewModel(consentsStore, globalStore);
    }
  }

  getGeoHandlingListViewModel = () => this.consentsList;
}

export default GeoHandlingViewModel;
