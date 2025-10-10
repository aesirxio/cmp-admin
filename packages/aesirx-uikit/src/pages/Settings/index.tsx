import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="d-flex flex-row justify-content-between py-4 px-3">
        <div>
          <h2 className="text-body">{t('txt_title_profile_setting')}</h2>
          <span className="text-body">{t('txt_title_set_information_name')}</span>
        </div>
      </div>

      <div className="py-4 px-3 bg-white mx-3 rounded-3">
        <div className="w-80-percent">
          <h2 className="text-body mb-3">{t('txt_general_information')}</h2>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };
