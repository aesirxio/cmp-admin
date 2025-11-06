/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class AIAdvisorListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusAIAdvisor = PAGE_STATUS.READY;
  statusUpdateAIAdvisor = PAGE_STATUS.READY;
  aiAdvisor = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (activeDomain) => {
    this.getAIAdvisor(activeDomain);
  };

  getAIAdvisor = (activeDomain) => {
    this.statusAIAdvisor = PAGE_STATUS.LOADING;

    this.consentsStore.getAIAdvisor(
      activeDomain,
      this.callbackOnDataAIAdvisorListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  updateAIAdvisor = (data) => {
    this.statusUpdateAIAdvisor = PAGE_STATUS.LOADING;
    this.consentsStore.updateAIAdvisor(
      data,
      this.callbackOnDataUpdateAIAdvisorSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusAIAdvisor = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableAIAdvisorList = async (dataFilter) => {
    this.statusAIAdvisor = PAGE_STATUS.LOADING;
    this.dataFilterAIAdvisorList = {
      ...this.dataFilterAIAdvisorList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getAIAdvisor(
      this.dataFilterAIAdvisorList,
      dateRangeFilter,
      this.callbackOnDataAIAdvisorListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusAIAdvisor = PAGE_STATUS.READY;
    this.aiAdvisor = {};
    // notify(error.message, 'error');
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdateAIAdvisor = PAGE_STATUS.READY;
    // notify(error.message, 'error');
  };

  callbackOnDataAIAdvisorListSuccessHandler = (data) => {
    if (data) {
      this.statusAIAdvisor = PAGE_STATUS.READY;
      this.aiAdvisor = data;
    } else {
      this.statusAIAdvisor = PAGE_STATUS.ERROR;
      this.aiAdvisor = {};
    }
  };

  callbackOnDataUpdateAIAdvisorSuccessHandler = (data) => {
    if (data) {
      this.statusUpdateAIAdvisor = PAGE_STATUS.READY;
      this.aiAdvisor = data;
    } else {
      this.statusUpdateAIAdvisor = PAGE_STATUS.ERROR;
      this.aiAdvisor = {};
    }
  };
}

export default AIAdvisorListViewModel;
