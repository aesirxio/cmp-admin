/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AIAdvisorListViewModel from './AIAdvisorListViewModel';

class AIAdvisorViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new AIAdvisorListViewModel(consentsStore, globalStore);
    }
  }

  getAIAdvisorListViewModel = () => this.consentsList;
}

export default AIAdvisorViewModel;
