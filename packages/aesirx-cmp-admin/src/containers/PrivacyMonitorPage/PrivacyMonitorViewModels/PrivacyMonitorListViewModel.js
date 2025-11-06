/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class PrivacyMonitorListViewModel {
  privacyMonitorStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusPrivacyMonitor = PAGE_STATUS.READY;
  statusUpdatePrivacyMonitor = PAGE_STATUS.READY;
  privacyMonitor = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(privacyMonitorStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.privacyMonitorStore = privacyMonitorStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async () => {};

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusPrivacyMonitor = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusPrivacyMonitor = PAGE_STATUS.READY;
    this.privacyMonitor = {};
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdatePrivacyMonitor = PAGE_STATUS.READY;
  };

  callbackOnDataPrivacyMonitorListSuccessHandler = (data) => {
    if (data) {
      this.statusPrivacyMonitor = PAGE_STATUS.READY;
      this.privacyMonitor = data;
    } else {
      this.statusPrivacyMonitor = PAGE_STATUS.ERROR;
      this.privacyMonitor = {};
    }
  };

  callbackOnDataUpdatePrivacyMonitorSuccessHandler = (data) => {
    if (data) {
      this.statusUpdatePrivacyMonitor = PAGE_STATUS.READY;
      this.privacyMonitor = data;
    } else {
      this.statusUpdatePrivacyMonitor = PAGE_STATUS.ERROR;
      this.privacyMonitor = {};
    }
  };
}

export default PrivacyMonitorListViewModel;
