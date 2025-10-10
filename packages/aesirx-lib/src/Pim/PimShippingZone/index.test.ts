import { CityApiService } from '../PimCity';
import { CountryApiService } from '../PimCountry';
import { StateApiService } from '../PimState';
import { ShippingZoneApiService } from './index';
import { describe, expect } from '@jest/globals';
let createID: any = '';
let listItemsCountry: any = '';
let listItemsState: any = '';
let listItemsCity: any = '';
describe('ShippingZone', () => {
  it('Get List Country', async () => {
    const service = new CountryApiService();

    const filters = {
      'list[limitstart]': 0,
      'list[limit]': 2,
    };

    const data = await service.getList(filters);
    listItemsCountry = data?.listItems;
    expect(data?.listItems?.length).toBeGreaterThan(0);
  });
  it('Get List State', async () => {
    const service = new StateApiService();

    const filters = {
      'list[limitstart]': 0,
      'list[limit]': 2,
    };

    const data = await service.getList(filters);
    listItemsState = data?.listItems;
    expect(data?.listItems?.length).toBeGreaterThan(0);
  });
  it('Get List City', async () => {
    const service = new CityApiService();

    const filters = {
      'list[limitstart]': 0,
      'list[limit]': 2,
    };

    const data = await service.getList(filters);
    listItemsCity = data?.listItems;
    expect(data?.listItems?.length).toBeGreaterThan(0);
  });
  it('Create', async () => {
    const service = new ShippingZoneApiService();

    const data = {
      items: [
        {
          country_id: listItemsCountry[0]?.id,
          state_id: listItemsState[0]?.id,
          city_id: listItemsCity[0]?.id,
          zip_start: '000',
          zip_end: '999',
        },
      ],
    };

    const response = await service.create(data);
    createID = response?.items[0];

    expect(createID).not.toBeNull();
    expect(createID).toBeDefined();
    expect(createID).not.toBeUndefined();
    expect(createID).not.toBe('false');
  });
  it('Get List', async () => {
    const service = new ShippingZoneApiService();

    const filters = {
      'list[limitstart]': 0,
      'list[limit]': 2,
    };

    const data = await service.getList(filters);

    expect(data?.listItems?.length).toBeGreaterThan(0);
  });

  it('Get Detail', async () => {
    const service = new ShippingZoneApiService();

    const response: any = await service.getDetail(createID);

    expect(response?.id).toEqual(createID);
  });

  it('Delete', async () => {
    const service = new ShippingZoneApiService();

    const response = await service.delete([createID]);

    expect(response).toBeTruthy();
  });
});
