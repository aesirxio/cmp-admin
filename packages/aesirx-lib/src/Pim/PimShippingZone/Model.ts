/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import BaseItemModel from '../../Abstract/BaseItemModel';
import BaseModel from '../../Abstract/BaseModel';
import { PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY } from '../../Constant/PimConstant';

class ShippingZoneModel extends BaseModel {
  constructor(entities: any) {
    super(entities);
    if (entities) {
      this.items = entities._embedded.item.map((element: any) => {
        return new ShippingZoneItemModel(element);
      });
    }
  }
}

class ShippingZoneItemModel extends BaseItemModel {
  id: any = null;
  country: any = null;
  country_id: any = null;
  state: any = null;
  state_id: any = null;
  city: any = null;
  city_id: any = null;
  zip_start: any = null;
  zip_end: any = null;
  published: any = null;
  created_user_name: any = null;
  modified_user_name: any = null;
  created_time: any = null;
  publish_up: any = null;
  modified_time: any = null;
  custom_fields: any = null;

  constructor(entity: any) {
    super(entity);
    if (entity) {
      this.id = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ID] ?? '';
      this.country = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.COUNTRY] ?? '';
      this.country_id = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.COUNTRY_ID] ?? '';
      this.state = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.STATE] ?? '';
      this.state_id = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.STATE_ID] ?? '';
      this.city = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CITY] ?? '';
      this.city_id = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CITY_ID] ?? '';
      this.zip_start = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ZIP_START] ?? '';
      this.zip_end = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ZIP_END] ?? '';
      this.published = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.PUBLISHED] ?? '';
      this.created_user_name = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CREATED_USER_NAME] ?? '';
      this.modified_user_name = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.MODIFIED_USER_NAME] ?? '';
      this.created_time = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CREATED_TIME] ?? '';
      this.publish_up = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.PUBLISH_UP] ?? '';
      this.modified_time = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.MODIFIED_TIME] ?? '';
      this.custom_fields = entity[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS] ?? '';
    }
  }

  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ID]: this.id,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.COUNTRY]: this.country,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.COUNTRY_ID]: this.country_id,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.STATE]: this.state,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.STATE_ID]: this.state_id,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CITY]: this.city,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CITY_ID]: this.city_id,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ZIP_START]: this.zip_start,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ZIP_END]: this.zip_end,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.TITLE]: this.title,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.PUBLISHED]: this.published,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CREATED_USER_NAME]: this.created_user_name,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.MODIFIED_USER_NAME]: this.modified_user_name,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CREATED_TIME]: this.created_time,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.PUBLISH_UP]: this.publish_up,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.MODIFIED_TIME]: this.modified_time,
      [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS]: this.custom_fields,
    };
  };

  static __transformItemToApiOfCreation = (data: any) => {
    let formData: any = {};
    const excluded = [
      PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.ID,
      PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS,
    ];
    Object.keys(PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY).forEach((index) => {
      if (
        !excluded.includes(PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]) &&
        data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]]
      ) {
        formData[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]] =
          data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]];
      }
    });
    if (
      data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS] &&
      Object.keys(data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS]).length
    ) {
      formData[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS] = {};
      Object.keys(data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS]).forEach(function (key) {
        formData[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS][key] =
          data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS][key];
      });
    }

    return { items: [formData] };
  };

  static __transformItemToApiOfUpdation = (data: any) => {
    let formData: any = {};
    const excluded = [PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS];
    Object.keys(PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY).forEach((index) => {
      if (
        !excluded.includes(PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]) &&
        data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]]
      ) {
        formData[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]] =
          data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY[index]];
      }
    });
    if (
      data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS] &&
      Object.keys(data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS]).length
    ) {
      formData[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS] = {};
      Object.keys(data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS]).forEach(function (key) {
        formData[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS][key] =
          data[PIM_SHIPPING_ZONE_DETAIL_FIELD_KEY.CUSTOM_FIELDS][key];
      });
    }
    return { items: [formData] };
  };
}

export { ShippingZoneModel, ShippingZoneItemModel };
