import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class DataStreamPage extends Component {
  render() {
    const { t } = this.props;

    return (
      <>
        <div className="py-4 px-4 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <div className="position-relative">
              <h1 className="fw-bold mb-8px fs-2">{t('txt_menu_data_stream')}</h1>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withTranslation()(DataStreamPage);
