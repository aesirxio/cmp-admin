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
const FormUrl = ({ field, ...props }: any) => {
  const { t } = props;
  const [listOptions, setListOptions] = useState(
    field?.getValueSelected?.length ? field?.getValueSelected : [{ url: '', title: '' }]
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
              <Col xs={4}>
                <Input
                  key={index + option?.url}
                  field={{
                    key: index + option?.url,
                    getValueSelected: option?.url,
                    classNameInput: 'fs-14',
                    placeholder: 'Url',
                    handleChange: (data: any) => {
                      listOptions[index] = { ...listOptions[index], url: data.target.value };
                      setListOptions(listOptions);
                      field.handleChange(listOptions);
                    },
                  }}
                />
              </Col>
              <Col xs={8}>
                <div className="d-flex">
                  <div className="w-100">
                    <Input
                      key={index + option?.title}
                      field={{
                        key: index + option?.title,
                        getValueSelected: option?.title,
                        classNameInput: 'fs-14',
                        placeholder: 'Title',
                        handleChange: (data: any) => {
                          listOptions[index] = { ...listOptions[index], title: data.target.value };
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
            setListOptions([...listOptions, { url: '', title: '' }]);
          }}
        >
          <SVGComponent url="/assets/images/plus.svg" className={`me-15`} />
          {t('txt_add')}
        </Button>
      )}
    </>
  );
};

const A = withTranslation()(FormUrl);

export { A as FormUrl };
