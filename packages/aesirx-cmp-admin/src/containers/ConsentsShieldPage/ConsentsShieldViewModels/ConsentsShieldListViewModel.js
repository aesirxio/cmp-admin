/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class ConsentsShieldListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusConsentsShield = PAGE_STATUS.READY;
  statusUpdateConsentsShield = PAGE_STATUS.READY;
  consentsShield = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (activeDomain) => {
    this.getConsentsShield(activeDomain);
  };

  getConsentsShield = (activeDomain) => {
    this.statusConsentsShield = PAGE_STATUS.LOADING;

    this.consentsStore.getConsentsShield(
      activeDomain,
      this.callbackOnDataConsentsShieldListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  updateConsentsShield = (data, isLoading = true) => {
    if (isLoading) {
      this.statusUpdateConsentsShield = PAGE_STATUS.LOADING;
    }
    this.consentsStore.updateConsentsShield(
      data,
      this.callbackOnDataUpdateConsentShieldSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler,
      isLoading
    );
  };

  updateConsentsTrial = (data, isLoading = true) => {
    if (isLoading) {
      this.statusUpdateConsentsShield = PAGE_STATUS.LOADING;
    }
    this.consentsStore.updateConsentsShield(
      data,
      this.callbackOnDataUpdateConsentShieldSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler,
      isLoading
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusConsentsShield = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableConsentsShieldList = async (dataFilter) => {
    this.statusConsentsShield = PAGE_STATUS.LOADING;
    this.dataFilterConsentsShieldList = {
      ...this.dataFilterConsentsShieldList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getConsentsShield(
      this.dataFilterConsentsShieldList,
      dateRangeFilter,
      this.callbackOnDataConsentsShieldListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusConsentsShield = PAGE_STATUS.READY;
    this.consentsShield = {};
    // notify(error.message, 'error');
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdateConsentsShield = PAGE_STATUS.READY;
    // notify(error.message, 'error');
  };

  callbackOnDataConsentsShieldListSuccessHandler = (data) => {
    if (data) {
      this.statusConsentsShield = PAGE_STATUS.READY;
      this.consentsShield = data;
    } else {
      this.statusConsentsShield = PAGE_STATUS.ERROR;
      this.consentsShield = {};
    }
  };

  callbackOnDataUpdateConsentShieldSuccessHandler = (data, isLoading) => {
    if (data) {
      if (isLoading) {
        this.statusUpdateConsentsShield = PAGE_STATUS.READY;
        isLoading && notify('Update Successful');
      }
      this.consentsShield = data;
    } else {
      this.statusUpdateConsentsShield = PAGE_STATUS.ERROR;
      this.consentsShield = {};
    }
  };
}

export default ConsentsShieldListViewModel;
