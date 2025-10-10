/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const FormCheckbox = ({ field }: any) => {
  const [selectedValue, setSelectedValue] = useState(field.getValueSelected?.value ?? []);
  useEffect(() => {
    if (field.getValueSelected?.value) {
      setSelectedValue(field.getValueSelected?.value);
    }
  }, [field.getValueSelected?.value]);

  useEffect(() => {
    field.handleChange(selectedValue);
  }, [selectedValue]);

  const handleChange = (data: any) => {
    if (data.target.checked) {
      setSelectedValue((current: any) => [...current, data.target.value]);
    } else {
      setSelectedValue((current: any) => current.filter((item: any) => item !== data.target.value));
    }
  };
  return (
    <div className="d-flex align-items-center w-100 flex-wrap">
      {field.getDataSelectOptions?.map(
        (option: any, key: any) =>
          option.label && (
            <Form.Check
              key={field.key + key}
              className={`mb-0 ${option.className}`}
              inline
              label={option.label}
              value={option.value}
              name={field.key}
              type={'checkbox'}
              id={`inline-radio-${field.key}-${option.value}`}
              onChange={handleChange}
              onBlur={field?.blurred}
              checked={selectedValue?.includes(option.value)}
            />
          )
      )}
      {field?.isCheckAll && (
        <div className="d-flex align-items-center w-100 mt-2">
          <Button
            variant="success"
            className="mx-1 py-1"
            onClick={() => {
              setSelectedValue(field.getDataSelectOptions.map((item: any) => item?.value));
            }}
          >
            Check All
          </Button>
          <Button
            variant="danger"
            className="mx-1 py-1"
            onClick={() => {
              setSelectedValue('');
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export { FormCheckbox };
