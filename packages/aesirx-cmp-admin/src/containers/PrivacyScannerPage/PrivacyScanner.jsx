import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrivacyScannerViewModel } from './PrivacyScannerViewModels/PrivacyScannerViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';

const PrivacyScanner = observer(() => {
  const { t } = useTranslation();
  const {
    privacyScannerList: { initialize },
  } = usePrivacyScannerViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div>
        <iframe
          style={{ width: 'calc(100% - 20px)', height: 'calc(90vh - 20px)' }}
          src="https://aesirx.io/services/privacy-scanner"
        ></iframe>
      </div>
    </div>
  );
});

export default PrivacyScanner;
