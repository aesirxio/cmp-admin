import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PrivacyScannerStore from './PrivacyScannerStore/PrivacyScannerStore';
import { PrivacyScannerViewModelContextProvider } from './PrivacyScannerViewModels/PrivacyScannerViewModelContextProvider';
import PrivacyScannerViewModel from './PrivacyScannerViewModels/PrivacyScannerViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const PrivacyScanner = lazy(() => import('./PrivacyScanner'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <PrivacyScanner {...props} />;
  }
};

const PrivacyScannerPage = observer(
  class PrivacyScannerPage extends Component {
    privacyScannerStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.privacyScannerStore = new PrivacyScannerStore({});

      this.behaviorViewModel = new PrivacyScannerViewModel(
        this.privacyScannerStore,
        this.biListViewModellog
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <PrivacyScannerViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </PrivacyScannerViewModelContextProvider>
      );
    }
  }
);

const ComponentToPrint = observer(
  class extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="aesirxui">
          {this.props.integration ? (
            <RenderComponent
              link={this.props.integrationLink}
              activeDomain={this.props.activeDomain}
              {...this.props}
            />
          ) : (
            <>
              <Route exact path={['/privacy-scanner']}>
                <PrivacyScanner />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(PrivacyScannerPage)));
