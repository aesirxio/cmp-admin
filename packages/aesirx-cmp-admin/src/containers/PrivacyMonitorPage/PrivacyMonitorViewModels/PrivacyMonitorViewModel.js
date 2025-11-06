/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PrivacyMonitorListViewModel from './PrivacyMonitorListViewModel';

class PrivacyMonitorViewModel {
  privacyMonitorList = null;
  constructor(privacyMonitorStore, globalStore) {
    if (privacyMonitorStore) {
      this.privacyMonitorList = new PrivacyMonitorListViewModel(privacyMonitorStore, globalStore);
    }
  }

  getPrivacyMonitorListViewModel = () => this.privacyMonitorList;
}

export default PrivacyMonitorViewModel;
