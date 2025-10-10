import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import GeoHandlingStore from './GeoHandlingStore/GeoHandlingStore';
import { GeoHandlingViewModelContextProvider } from './GeoHandlingViewModels/GeoHandlingViewModelContextProvider';
import GeoHandlingViewModel from './GeoHandlingViewModels/GeoHandlingViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const GeoHandling = lazy(() => import('./GeoHandling'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'geo-handling':
      return <GeoHandling {...props} />;

    default:
      return <GeoHandling {...props} />;
  }
};

const GeoHandlingPage = observer(
  class GeoHandlingPage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new GeoHandlingStore({});

      this.behaviorViewModel = new GeoHandlingViewModel(
        this.consentsStore,
        this.biListViewModellog
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <GeoHandlingViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </GeoHandlingViewModelContextProvider>
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
              <Route exact path={['/geo-handling']}>
                <GeoHandling />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(GeoHandlingPage)));
