import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ConsentsShieldStore from './ConsentsShieldStore/ConsentsShieldStore';
import { ConsentsShieldViewModelContextProvider } from './ConsentsShieldViewModels/ConsentsShieldViewModelContextProvider';
import ConsentsShieldViewModel from './ConsentsShieldViewModels/ConsentsShieldViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const ConsentsShield = lazy(() => import('./ConsentsShield'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'consents-shield':
      return <ConsentsShield {...props} />;

    default:
      return <ConsentsShield {...props} />;
  }
};

const ConsentsShieldPage = observer(
  class ConsentsShieldPage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new ConsentsShieldStore({});

      this.behaviorViewModel = new ConsentsShieldViewModel(
        this.consentsStore,
        this.biListViewModellog
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <ConsentsShieldViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </ConsentsShieldViewModelContextProvider>
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
              <Route exact path={['/']}>
                <ConsentsShield />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(ConsentsShieldPage)));
