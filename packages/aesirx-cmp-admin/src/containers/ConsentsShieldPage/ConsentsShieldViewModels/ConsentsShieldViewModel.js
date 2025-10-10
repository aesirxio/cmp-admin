/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import ConsentsShieldListViewModel from './ConsentsShieldListViewModel';

class ConsentsShieldViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new ConsentsShieldListViewModel(consentsStore, globalStore);
    }
  }

  getConsentsShieldListViewModel = () => this.consentsList;
}

export default ConsentsShieldViewModel;
