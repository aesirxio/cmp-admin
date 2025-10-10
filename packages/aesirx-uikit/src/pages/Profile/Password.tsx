/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, createRef } from 'react';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';

import SimpleReactValidator from 'simple-react-validator';
import { Storage } from 'aesirx-lib';
import { withTranslation } from 'react-i18next';
import { UPDATE_PASSWORD_FIELD_KEY } from 'constant/Profile';
import { withProfileContext } from './model';
import { notify } from 'components';
import { PAGE_STATUS } from 'constant/PageStatus';

const UpdatePassword = observer(
  class UpdatePassword extends Component {
    updatePasswordViewModel: any = null;
    formPropsData = {
      [UPDATE_PASSWORD_FIELD_KEY.ID]: Storage.getItem('member_id'),
      [UPDATE_PASSWORD_FIELD_KEY.CURR_PASSWORD]: '',
      [UPDATE_PASSWORD_FIELD_KEY.NEW_PASSWORD]: '',
      [UPDATE_PASSWORD_FIELD_KEY.NEW_CHECKED_PASSWORD]: '',
    };
    validator: SimpleReactValidator;
    currentPassword: any;
    newPassword: any;
    newCheckedPassword: any;

    state = {
      loading: false,
    };

    constructor(props: any) {
      super(props);

      const { model }: any = this.props;
      this.updatePasswordViewModel = model;

      this.state = {
        loading: false,
      };

      this.validator = new SimpleReactValidator();

      this.currentPassword = createRef();
      this.newPassword = createRef();
      this.newCheckedPassword = createRef();
      this.handleInputChange = this.handleInputChange.bind(this);
      this.validateInfoBeforeSending = this.validateInfoBeforeSending.bind(this);
    }

    resetValue(content_id: string) {
      if (content_id === 'wrong_current_password') {
        notify('The current password is wrong', 'error');

        this.currentPassword.current.value = '';

        this.setState({ loading: false });
      }
      this.updatePasswordViewModel.successResponse.state = true;
    }

    handleInputChange(type: any, value: any) {
      this.formPropsData[type] = value;
      this.forceUpdate();
    }

    savePasswordHandler = () => {
      this.updatePasswordViewModel.savePassword(this.formPropsData);
    };

    onKeyPress = (e: any) => {
      if (e.which === 13) {
        this.validateInfoBeforeSending();
      }
    };

    blurringFieldHandler = () => {
      this.validator.hideMessageFor('password');
    };

    validateInfoBeforeSending = () => {
      if (this.validator.allValid()) {
        if (
          this.formPropsData[UPDATE_PASSWORD_FIELD_KEY.NEW_PASSWORD] !==
          this.formPropsData[UPDATE_PASSWORD_FIELD_KEY.NEW_CHECKED_PASSWORD]
        ) {
          notify('Password and confirm password does not match.', 'error');

          this.newPassword.current.value = '';
          this.newCheckedPassword.current.value = '';

          return false;
        }

        this.setState({ loading: true });
        this.savePasswordHandler();
      } else {
        this.validator.showMessages();
        this.forceUpdate();
        return false;
      }
    };

    render() {
      const { t, model }: any = this.props;

      if (model.formStatus === PAGE_STATUS.LOADING) {
        return <></>;
      }

      if (!model.successResponse.state) this.resetValue(model.successResponse.content_id);

      this.validator.purgeFields();

      return (
        <div>
          <div className="bg-white p-3">
            <form>
              <div className="row">
                <div className="col-4">
                  <label className="form-label mb-3" htmlFor="curr_password">
                    <span className="text-body">{t('txt_current_password')}</span>
                  </label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    id="curr_password"
                    onBlur={this.blurringFieldHandler}
                    disabled={this.state.loading}
                    onChange={(event) =>
                      this.handleInputChange('curr_password', event.target.value)
                    }
                    name="curr_password"
                    ref={this.currentPassword}
                  />
                  {this.validator.message(
                    'password',
                    this.formPropsData[UPDATE_PASSWORD_FIELD_KEY.CURR_PASSWORD],
                    'required|min:6|max:30',
                    { className: 'text-danger' }
                  )}
                </div>
                <div className="col-4">
                  <label className="form-label mb-3" htmlFor="new_password">
                    <span className="text-body">{t('txt_new_password')}</span>
                  </label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    id="new_password"
                    onBlur={this.blurringFieldHandler}
                    disabled={this.state.loading}
                    onChange={(event) => this.handleInputChange('new_password', event.target.value)}
                    name="new_password"
                    ref={this.newPassword}
                  />
                  {this.validator.message(
                    'password',
                    this.formPropsData[UPDATE_PASSWORD_FIELD_KEY.NEW_PASSWORD],
                    'required|min:6|max:30',
                    { className: 'text-danger' }
                  )}
                </div>
                <div className="col-4">
                  <label className="form-label mb-3" htmlFor="new_password">
                    <span className="text-body text-nowrap">{t('txt_confirm_password')}</span>
                  </label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    id="new_checked_password"
                    onBlur={this.blurringFieldHandler}
                    disabled={this.state.loading}
                    onChange={(event) =>
                      this.handleInputChange('new_checked_password', event.target.value)
                    }
                    name="new_checked_password"
                    ref={this.newCheckedPassword}
                    onKeyPress={this.onKeyPress}
                  />
                  {this.validator.message(
                    'password',
                    this.formPropsData[UPDATE_PASSWORD_FIELD_KEY.NEW_CHECKED_PASSWORD],
                    'required|min:6|max:30',
                    { className: 'text-danger' }
                  )}
                </div>
              </div>
              {this.state.loading && model.successResponse.state ? (
                <button className="btn btn-success" disabled={this.state.loading}>
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.validateInfoBeforeSending();
                  }}
                  className="btn btn-success d-flex align-items-center ps-3 pe-3"
                >
                  <i>
                    <FontAwesomeIcon icon={faCog} />
                  </i>
                  <span className="flex-1 ps-2">{t('txt_update')}</span>
                </button>
              )}
            </form>
          </div>
        </div>
      );
    }
  }
);

const E = withTranslation()(withProfileContext(UpdatePassword));

export { E as ProfilePassword };
