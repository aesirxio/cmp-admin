import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import AIAdvisorStore from './AIAdvisorStore/AIAdvisorStore';
import { AIAdvisorViewModelContextProvider } from './AIAdvisorViewModels/AIAdvisorViewModelContextProvider';
import AIAdvisorViewModel from './AIAdvisorViewModels/AIAdvisorViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const AIAdvisor = lazy(() => import('./AIAdvisor'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'ai-advisor':
      return <AIAdvisor {...props} />;

    default:
      return <AIAdvisor {...props} />;
  }
};

const AIAdvisorPage = observer(
  class AIAdvisorPage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new AIAdvisorStore({});

      this.behaviorViewModel = new AIAdvisorViewModel(this.consentsStore, this.biListViewModellog);
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <AIAdvisorViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </AIAdvisorViewModelContextProvider>
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
              <Route exact path={['/ai-advisor']}>
                <AIAdvisor />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(AIAdvisorPage)));
