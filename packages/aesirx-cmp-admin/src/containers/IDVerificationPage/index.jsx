import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import IDVerificationStore from './IDVerificationStore/IDVerificationStore';
import { IDVerificationViewModelContextProvider } from './IDVerificationViewModels/IDVerificationViewModelContextProvider';
import IDVerificationViewModel from './IDVerificationViewModels/IDVerificationViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const IDVerification = lazy(() => import('./IDVerification'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <IDVerification {...props} />;
  }
};

const IDVerificationPage = observer(
  class IDVerificationPage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new IDVerificationStore({});

      this.behaviorViewModel = new IDVerificationViewModel(
        this.consentsStore,
        this.biListViewModellog
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <IDVerificationViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </IDVerificationViewModelContextProvider>
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
              <Route exact path={['/id-verification']}>
                <IDVerification />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(IDVerificationPage)));
