/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class ConsentsLogicListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusConsentsLogic = PAGE_STATUS.READY;
  statusUpdateConsentsLogic = PAGE_STATUS.READY;
  consentsLogic = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (activeDomain) => {
    this.getConsentsLogic(activeDomain);
  };

  getConsentsLogic = (activeDomain) => {
    this.statusConsentsLogic = PAGE_STATUS.LOADING;

    this.consentsStore.getConsentsLogic(
      activeDomain,
      this.callbackOnDataConsentsLogicListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  updateConsentsLogic = (data) => {
    this.statusUpdateConsentsLogic = PAGE_STATUS.LOADING;
    this.consentsStore.updateConsentsLogic(
      data,
      this.callbackOnDataUpdateConsentLogicSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusConsentsLogic = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableConsentsLogicList = async (dataFilter) => {
    this.statusConsentsLogic = PAGE_STATUS.LOADING;
    this.dataFilterConsentsLogicList = {
      ...this.dataFilterConsentsLogicList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getConsentsLogic(
      this.dataFilterConsentsLogicList,
      dateRangeFilter,
      this.callbackOnDataConsentsLogicListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusConsentsLogic = PAGE_STATUS.READY;
    this.consentsLogic = {};
    // notify(error.message, 'error');
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdateConsentsLogic = PAGE_STATUS.READY;
    // notify(error.message, 'error');
  };

  callbackOnDataConsentsLogicListSuccessHandler = (data) => {
    if (data) {
      this.statusConsentsLogic = PAGE_STATUS.READY;
      this.consentsLogic = data;
    } else {
      this.statusConsentsLogic = PAGE_STATUS.ERROR;
      this.consentsLogic = {};
    }
  };

  callbackOnDataUpdateConsentLogicSuccessHandler = (data) => {
    if (data) {
      this.statusUpdateConsentsLogic = PAGE_STATUS.READY;
      this.consentsLogic = data;
      notify('Update Successful');
    } else {
      this.statusUpdateConsentsLogic = PAGE_STATUS.ERROR;
      this.consentsLogic = {};
    }
  };
}

export default ConsentsLogicListViewModel;
