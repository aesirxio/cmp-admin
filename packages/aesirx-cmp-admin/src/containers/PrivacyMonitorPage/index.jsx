import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import PrivacyMonitorStore from './PrivacyMonitorStore/PrivacyMonitorStore';
import { PrivacyMonitorViewModelContextProvider } from './PrivacyMonitorViewModels/PrivacyMonitorViewModelContextProvider';
import PrivacyMonitorViewModel from './PrivacyMonitorViewModels/PrivacyMonitorViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const PrivacyMonitor = lazy(() => import('./PrivacyMonitor'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <PrivacyMonitor {...props} />;
  }
};

const PrivacyMonitorPage = observer(
  class PrivacyMonitorPage extends Component {
    privacyMonitorStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.privacyMonitorStore = new PrivacyMonitorStore({});

      this.behaviorViewModel = new PrivacyMonitorViewModel(
        this.privacyMonitorStore,
        this.biListViewModellog
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <PrivacyMonitorViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </PrivacyMonitorViewModelContextProvider>
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
              <Route exact path={['/privacy-monitor']}>
                <PrivacyMonitor />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(PrivacyMonitorPage)));
