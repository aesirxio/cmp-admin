import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ConsentsLogicStore from './ConsentsLogicStore/ConsentsLogicStore';
import { ConsentsLogicViewModelContextProvider } from './ConsentsLogicViewModels/ConsentsLogicViewModelContextProvider';
import ConsentsLogicViewModel from './ConsentsLogicViewModels/ConsentsLogicViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const ConsentsLogic = lazy(() => import('./ConsentsLogic'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'consent-logic':
      return <ConsentsLogic {...props} />;

    default:
      return <ConsentsLogic {...props} />;
  }
};

const ConsentsLogicPage = observer(
  class ConsentsLogicPage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new ConsentsLogicStore({});

      this.behaviorViewModel = new ConsentsLogicViewModel(
        this.consentsStore,
        this.biListViewModellog
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <ConsentsLogicViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </ConsentsLogicViewModelContextProvider>
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
              <Route exact path={['/consent-logic']}>
                <ConsentsLogic />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(ConsentsLogicPage)));
