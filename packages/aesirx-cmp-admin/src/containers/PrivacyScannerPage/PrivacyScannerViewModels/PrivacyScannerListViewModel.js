/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class PrivacyScannerListViewModel {
  privacyScannerStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusPrivacyScanner = PAGE_STATUS.READY;
  statusUpdatePrivacyScanner = PAGE_STATUS.READY;
  privacyScanner = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(privacyScannerStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.privacyScannerStore = privacyScannerStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async () => {};

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusPrivacyScanner = PAGE_STATUS.LOADING;
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
    this.statusPrivacyScanner = PAGE_STATUS.READY;
    this.privacyScanner = {};
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdatePrivacyScanner = PAGE_STATUS.READY;
  };

  callbackOnDataPrivacyScannerListSuccessHandler = (data) => {
    if (data) {
      this.statusPrivacyScanner = PAGE_STATUS.READY;
      this.privacyScanner = data;
    } else {
      this.statusPrivacyScanner = PAGE_STATUS.ERROR;
      this.privacyScanner = {};
    }
  };

  callbackOnDataUpdatePrivacyScannerSuccessHandler = (data) => {
    if (data) {
      this.statusUpdatePrivacyScanner = PAGE_STATUS.READY;
      this.privacyScanner = data;
    } else {
      this.statusUpdatePrivacyScanner = PAGE_STATUS.ERROR;
      this.privacyScanner = {};
    }
  };
}

export default PrivacyScannerListViewModel;
