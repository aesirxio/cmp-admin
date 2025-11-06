import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrivacyMonitorViewModel } from './PrivacyMonitorViewModels/PrivacyMonitorViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';

const PrivacyMonitor = observer(() => {
  const { t } = useTranslation();
  const {
    privacyMonitorList: { initialize },
  } = usePrivacyMonitorViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div>
        <iframe
          style={{ width: 'calc(100% - 20px)', height: 'calc(90vh - 20px)' }}
          src="https://aesirx.io/services/privacy-monitoring"
        ></iframe>
      </div>
    </div>
  );
});

export default PrivacyMonitor;
