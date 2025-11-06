/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PrivacyScannerListViewModel from './PrivacyScannerListViewModel';

class PrivacyScannerViewModel {
  privacyScannerList = null;
  constructor(privacyScannerStore, globalStore) {
    if (privacyScannerStore) {
      this.privacyScannerList = new PrivacyScannerListViewModel(privacyScannerStore, globalStore);
    }
  }

  getPrivacyScannerListViewModel = () => this.privacyScannerList;
}

export default PrivacyScannerViewModel;
