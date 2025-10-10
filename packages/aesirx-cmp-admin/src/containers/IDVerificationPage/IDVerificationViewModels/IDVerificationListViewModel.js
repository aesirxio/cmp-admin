/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class IDVerificationListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusIDVerification = PAGE_STATUS.READY;
  statusUpdateIDVerification = PAGE_STATUS.READY;
  consentsVerification = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (activeDomain) => {
    this.getIDVerification(activeDomain);
  };

  getIDVerification = (activeDomain) => {
    this.statusIDVerification = PAGE_STATUS.LOADING;

    this.consentsStore.getIDVerification(
      activeDomain,
      this.callbackOnDataIDVerificationListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  updateIDVerification = (data) => {
    this.statusUpdateIDVerification = PAGE_STATUS.LOADING;
    this.consentsStore.updateIDVerification(
      data,
      this.callbackOnDataUpdateIDVerificationSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusIDVerification = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableIDVerificationList = async (dataFilter) => {
    this.statusIDVerification = PAGE_STATUS.LOADING;
    this.dataFilterIDVerificationList = {
      ...this.dataFilterIDVerificationList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getIDVerification(
      this.dataFilterIDVerificationList,
      dateRangeFilter,
      this.callbackOnDataIDVerificationListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusIDVerification = PAGE_STATUS.READY;
    this.consentsVerification = {};
    // notify(error.message, 'error');
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdateIDVerification = PAGE_STATUS.READY;
    // notify(error.message, 'error');
  };

  callbackOnDataIDVerificationListSuccessHandler = (data) => {
    if (data) {
      this.statusIDVerification = PAGE_STATUS.READY;
      this.consentsVerification = data;
    } else {
      this.statusIDVerification = PAGE_STATUS.ERROR;
      this.consentsVerification = {};
    }
  };

  callbackOnDataUpdateIDVerificationSuccessHandler = (data) => {
    if (data) {
      this.statusUpdateIDVerification = PAGE_STATUS.READY;
      this.consentsVerification = data;
      notify('Update Successful');
    } else {
      this.statusUpdateIDVerification = PAGE_STATUS.ERROR;
      this.consentsVerification = {};
    }
  };
}

export default IDVerificationListViewModel;
