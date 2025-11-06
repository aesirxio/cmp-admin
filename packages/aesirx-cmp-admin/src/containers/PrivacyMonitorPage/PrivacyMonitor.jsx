import React from 'react';
import { observer } from 'mobx-react';

const PrivacyMonitor = observer(() => {
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
