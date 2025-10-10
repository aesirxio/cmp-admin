/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import './index.scss';
import { withTranslation } from 'react-i18next';
import { SVGComponent } from 'components/SVGComponent';
import { Input } from '../Input';
const FormYoutube = ({ field, ...props }: any) => {
  const { t } = props;
  const [listOptions, setListOptions] = useState(
    field?.getValueSelected?.length ? field?.getValueSelected : ['']
  );
  useEffect(() => {
    field?.getValueSelected && setListOptions(field?.getValueSelected);
  }, []);
  return (
    <>
      {listOptions?.map((option: any, index: any) => {
        return (
          <div key={`${index}`} className="position-relative">
            <Row className="mb-16 gx-24">
              <Col xs={12}>
                <div className="d-flex">
                  <div className="w-100">
                    <Input
                      key={index + option?.value}
                      field={{
                        key: index + option?.value,
                        getValueSelected: option?.value,
                        classNameInput: 'fs-14',
                        placeholder: 'Value',
                        handleChange: (data: any) => {
                          listOptions[index] = { value: data.target.value };
                          setListOptions(listOptions);
                          field.handleChange(listOptions);
                        },
                      }}
                    />
                  </div>
                  <div
                    className="border-1 rounded-1 d-flex align-items-center justify-content-center ms-24 px-8px cursor-pointer"
                    onClick={() => {
                      const array = [...listOptions];
                      array.splice(index, 1);
                      setListOptions(array);
                      field.handleChange(array);
                    }}
                  >
                    <SVGComponent url="/assets/images/cancel.svg" className={'bg-danger'} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );
      })}
      {(field?.isMulti || (!field?.isMulti && listOptions?.length < 1)) && (
        <Button
          variant={`light`}
          className={`px-24 py-10 fw-semibold d-flex align-items-center rounded-1 border border-success border-da-1 mt-16`}
          onClick={() => {
            setListOptions([...listOptions, '']);
          }}
        >
          <SVGComponent url="/assets/images/plus.svg" className={`me-15`} />
          {t('txt_add')}
        </Button>
      )}
    </>
  );
};

const A = withTranslation()(FormYoutube);

export { A as FormYoutube };
