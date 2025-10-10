/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import ConsentsLogicListViewModel from './ConsentsLogicListViewModel';

class ConsentsLogicViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new ConsentsLogicListViewModel(consentsStore, globalStore);
    }
  }

  getConsentsLogicListViewModel = () => this.consentsList;
}

export default ConsentsLogicViewModel;
