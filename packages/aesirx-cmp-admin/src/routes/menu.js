import { env } from 'aesirx-lib';

const getMainMenu = (isAdmin = false) => {
  const mainMenu = [
    {
      text: 'txt_ai_privacy_advisor',
      mini_text: 'txt_ai_privacy_advisor',
      link: `/ai-advisor`,
      page: 'ai-advisor',
    },

    {
      text: 'txt_consent_modal',
      mini_text: 'txt_consent_modal',
      link: `/consent-template`,
      page: 'consent-template',
    },
    {
      text: 'txt_consent_log',
      mini_text: 'txt_consent_log',
      link: `/consents`,
      page: 'consents',
    },
    {
      text: 'txt_consent_logic',
      mini_text: 'txt_consent_logic',
      link: `/consent-logic`,
    },
    {
      text: 'txt_consent_analytics',
      mini_text: 'txt_consent_analytics',
      link: `/consent-advance`,
    },
    {
      text: 'txt_geo_handling',
      mini_text: 'txt_geo_handling',
      link: `/geo-handling`,
    },
    {
      text: 'txt_id_verification',
      mini_text: 'txt_id_verification',
      link: `/id-verification`,
    },
    {
      text: 'txt_privacy_scanner',
      mini_text: 'txt_privacy_scanner',
      link: `/privacy-scanner`,
    },
    {
      text: 'txt_privacy_monitor',
      mini_text: 'txt_privacy_monitor',
      link: `/privacy-monitor`,
    },
    ...(isAdmin
      ? [
          {
            text: 'User Handling',
            mini_text: 'User Handling',
            link: `/user-handling`,
          },
        ]
      : []),
    {
      text: 'Configuration',
      mini_text: 'Configuration',
      link: `/`,
      page: 'dashboard',
    },
  ];
  return mainMenu;
};

export { getMainMenu };
