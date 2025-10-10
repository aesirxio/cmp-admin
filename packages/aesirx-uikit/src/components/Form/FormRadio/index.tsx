/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const FormRadio = ({ field }: any) => {
  const [selectedValue, setSelectedValue] = useState(field.getValueSelected?.value);
  useEffect(() => {
    if (field.getValueSelected?.value) {
      setSelectedValue(field.getValueSelected?.value);
    }
  }, [field.getValueSelected?.value]);

  const handleChange = (data: any) => {
    setSelectedValue(data.target?.value);
    field.handleChange(data);
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
              type={'radio'}
              id={`inline-radio-${field.key}-${option.value}`}
              onChange={handleChange}
              onBlur={field?.blurred}
              checked={selectedValue === option.value}
            />
          )
      )}
      {field.isClearable && (
        <div className="d-flex align-items-center w-100 mt-2">
          <Button
            variant="danger"
            className="mx-1 py-1"
            onClick={() => {
              handleChange('');
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export { FormRadio };
