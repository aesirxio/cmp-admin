/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class GeoHandlingListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusGeoHandling = PAGE_STATUS.READY;
  statusUpdateGeoHandling = PAGE_STATUS.READY;
  geoHandling = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (activeDomain) => {
    this.getGeoHandling(activeDomain);
  };

  getGeoHandling = (activeDomain) => {
    this.statusGeoHandling = PAGE_STATUS.LOADING;

    this.consentsStore.getGeoHandling(
      activeDomain,
      this.callbackOnDataGeoHandlingListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  updateGeoHandling = (data) => {
    this.statusUpdateGeoHandling = PAGE_STATUS.LOADING;
    this.consentsStore.updateGeoHandling(
      data,
      this.callbackOnDataUpdateGeoHandlingSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusGeoHandling = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableGeoHandlingList = async (dataFilter) => {
    this.statusGeoHandling = PAGE_STATUS.LOADING;
    this.dataFilterGeoHandlingList = {
      ...this.dataFilterGeoHandlingList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getGeoHandling(
      this.dataFilterGeoHandlingList,
      dateRangeFilter,
      this.callbackOnDataGeoHandlingListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusGeoHandling = PAGE_STATUS.READY;
    this.geoHandling = {};
    // notify(error.message, 'error');
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdateGeoHandling = PAGE_STATUS.READY;
    // notify(error.message, 'error');
  };

  callbackOnDataGeoHandlingListSuccessHandler = (data) => {
    if (data) {
      this.statusGeoHandling = PAGE_STATUS.READY;
      this.geoHandling = data;
    } else {
      this.statusGeoHandling = PAGE_STATUS.ERROR;
      this.geoHandling = {};
    }
  };

  callbackOnDataUpdateGeoHandlingSuccessHandler = (data) => {
    if (data) {
      this.statusUpdateGeoHandling = PAGE_STATUS.READY;
      this.geoHandling = data;
      notify('Update Successful');
    } else {
      this.statusUpdateGeoHandling = PAGE_STATUS.ERROR;
      this.geoHandling = {};
    }
  };
}

export default GeoHandlingListViewModel;
