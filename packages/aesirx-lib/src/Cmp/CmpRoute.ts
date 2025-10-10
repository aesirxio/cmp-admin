/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AesirXApiInstance from '../Gateway/Instance';
import BaseRoute from '../Abstract/BaseRoute';
import { env } from '../env';

class CmpRoute extends BaseRoute {
  getConsentsTemplate = (domain: any) => {
    return AesirXApiInstance.get(
      this.createRequestURL(
        {
          url: `datastream/template/${domain}`,
        },
        false,
        env.REACT_APP_BI_ENDPOINT_URL ?? 'https://api.analytics.aesirx.io',
        true
      )
    );
  };
  updateConsentsTemplate = (data: any) => {
    console.log('updateConsentsTemplate');
    return AesirXApiInstance.post(
      this.createRequestURL(
        {
          url: `datastream/template`,
        },
        false,
        env.REACT_APP_BI_ENDPOINT_URL ?? 'https://api.analytics.aesirx.io',
        true
      ),
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          override: 'true',
        },
      }
    );
  };
}

export default CmpRoute;
