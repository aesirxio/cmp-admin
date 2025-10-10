import { runInAction } from 'mobx';

import { AesirxCmpApiService } from 'aesirx-lib';
export class ConsentsStore {
  getConsentsShield = async (activeDomain, callbackOnSuccess, callbackOnError) => {
    try {
      const cmpService = new AesirxCmpApiService();
      const responseDataFromLibrary = await cmpService.getConsentsTemplate(activeDomain);
      if (responseDataFromLibrary) {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary);
        });
      } else {
        callbackOnError({
          message: 'Something went wrong from Server response',
        });
      }
    } catch (error) {
      console.log('errorrrr', error);
      runInAction(() => {
        if (error.response?.data.error) {
          callbackOnError({
            message: error.response?.data?.error,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?.error
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };

  updateConsentsShield = async (data, callbackOnSuccess, callbackOnError, isLoading) => {
    try {
      const cmpService = new AesirxCmpApiService();
      const responseDataFromLibrary = await cmpService.updateConsentsTemplate(data);
      if (responseDataFromLibrary) {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary, isLoading);
        });
      } else {
        callbackOnError({
          message: 'Something went wrong from Server response',
        });
      }
    } catch (error) {
      console.log('errorrrr', error);
      runInAction(() => {
        if (error.response?.data.error) {
          callbackOnError({
            message: error.response?.data?.error,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?.error
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };
}

export default ConsentsStore;
