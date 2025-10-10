/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import CmpRoute from './CmpRoute';

import axios from 'axios';

/**
 * API Service - Member
 */
class AesirxCmpApiService {
  route: any = null;

  constructor() {
    this.route = new CmpRoute();
  }

  getConsentsTemplate = async (domain: any) => {
    try {
      const data = await this.route.getConsentsTemplate(domain);
      let results = null;
      if (data) {
        results = data;
      }
      return results;
    } catch (error) {
      if (axios.isCancel(error)) {
        return { message: 'isCancle' };
      } else throw error;
    }
  };

  updateConsentsTemplate = async (dataForm: any) => {
    try {
      const data = await this.route.updateConsentsTemplate(dataForm);
      let results = null;
      if (data) {
        results = data;
      }
      return results;
    } catch (error) {
      if (axios.isCancel(error)) {
        return { message: 'isCancle' };
      } else throw error;
    }
  };

  getIDVerification = async (domain: any) => {
    try {
      const data = await this.route.getIDVerification(domain);
      let results = null;
      if (data) {
        results = data;
      }
      return results;
    } catch (error) {
      if (axios.isCancel(error)) {
        return { message: 'isCancle' };
      } else throw error;
    }
  };

  updateIDVerification = async (dataForm: any) => {
    try {
      const data = await this.route.updateIDVerification(dataForm);
      let results = null;
      if (data) {
        results = data;
      }
      return results;
    } catch (error) {
      if (axios.isCancel(error)) {
        return { message: 'isCancle' };
      } else throw error;
    }
  };
}

export { AesirxCmpApiService };
