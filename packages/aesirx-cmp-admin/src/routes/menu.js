import { env } from 'aesirx-lib';

const mainMenu = [
  {
    text: 'txt_menu_consents',
    link: `/consents`,
    icons: env.PUBLIC_URL + '/assets/images/audience.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/audience.svg',
    page: 'consents',
    submenu: [
      {
        text: 'txt_consent_shield',
        mini_text: 'txt_consent_shield',
        link: `/`,
        page: 'dashboard',
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
        text: 'txt_ai_privacy_advisor',
        mini_text: 'txt_ai_privacy_advisor',
        link: `/ai-advisor`,
        page: 'ai-advisor',
      },
    ],
  },
];

export { mainMenu };
