/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import IDVerificationListViewModel from './IDVerificationListViewModel';

class IDVerificationViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new IDVerificationListViewModel(consentsStore, globalStore);
    }
  }

  getIDVerificationListViewModel = () => this.consentsList;
}

export default IDVerificationViewModel;
