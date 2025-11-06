import React, { useEffect, useState } from 'react';
import { useIDVerificationViewModel } from './IDVerificationViewModels/IDVerificationViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { PAGE_STATUS, AesirXSelect } from 'aesirx-uikit';
import { env } from 'aesirx-lib';
import { allCountries } from 'utils/countries';

const IDVerification = observer(() => {
  const {
    consentsList: {
      initialize,
      consentsVerification,
      updateIDVerification,
      statusUpdateIDVerification,
    },
  } = useIDVerificationViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  useEffect(() => {
    const execute = async () => {
      await initialize(activeDomain[0]);
    };
    execute();
    return () => {};
  }, [activeDomain]);

  const [values, setValues] = useState({
    domain: activeDomain[0],
    age_check: false,
    country_check: false,
    minimum_age: 0,
    maximum_age: 0,
    allowed_countries: [],
    disallowed_countries: [],
  });

  useEffect(() => {
    setValues({
      ...values,
      domain: consentsVerification?.domain,
      ...(consentsVerification?.age_check ? { age_check: consentsVerification?.age_check } : {}),
      ...(consentsVerification?.country_check
        ? { country_check: consentsVerification?.country_check }
        : {}),
      ...(consentsVerification?.country_check
        ? { country_check: consentsVerification?.country_check }
        : {}),
      ...(consentsVerification?.minimum_age
        ? { minimum_age: consentsVerification?.minimum_age }
        : {}),
      ...(consentsVerification?.maximum_age
        ? { maximum_age: consentsVerification?.maximum_age }
        : {}),
      ...(consentsVerification?.allowed_countries
        ? { allowed_countries: consentsVerification?.allowed_countries }
        : {}),
      ...(consentsVerification?.disallowed_countries
        ? { disallowed_countries: consentsVerification?.disallowed_countries }
        : {}),
    });
  }, [consentsVerification]);

  const handleSubmit = async () => {
    if (values) {
      await updateIDVerification(values);
    }
  };

  const countryOptions = Object.entries(allCountries)
    .map(([code, name]) => ({ value: code, label: name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  let showPreview = 'default';
  if (values?.age_check && values?.country_check) {
    showPreview = 'age-country';
  } else if (values?.age_check && !values?.country_check) {
    showPreview = 'age';
  } else if (!values?.age_check && values?.country_check) {
    showPreview = 'country';
  }
  console.log('values', values);
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">ID Verification</h2>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          {statusUpdateIDVerification === PAGE_STATUS.LOADING && (
            <Spinner size="sm" className="me-2" />
          )}
          Save
        </Button>
      </div>
      <Row className="gx-5">
        <Col lg={6}>
          <h4 className="fw-bold mb-8px">Age & Country Verification</h4>
          <div>
            This feature lets you restrict access by age or location using secure digital ID
            verification. Users without a wallet ID can create a Concordium ID with a passport or
            driver’s license. Verification uses zero-knowledge proofs, so the website never sees or
            stores personal details.
          </div>
          <Form.Group className="my-3" controlId="formIDVerification">
            <Row>
              <Col lg="12" className="mb-3">
                <div className="d-flex justify-content-start flex-column h-100">
                  <Form.Check
                    inline
                    label={`Enable Age Verification`}
                    onChange={(e) => {
                      setValues({ ...values, age_check: e?.target?.checked });
                    }}
                    checked={values?.age_check}
                    value={`values?.age_check`}
                    name="group1"
                    type="checkbox"
                    id={`inline-checkbox-age`}
                  />
                </div>
              </Col>
              <Col lg="12" className="mb-3">
                <div className="d-flex justify-content-start flex-column h-100">
                  <Form.Check
                    inline
                    label={`Enable Country Verification`}
                    onChange={(e) => {
                      setValues({ ...values, country_check: e?.target?.checked });
                    }}
                    checked={values?.country_check}
                    value={`countryCheck`}
                    name="group1"
                    type="checkbox"
                    id={`inline-checkbox-country`}
                  />
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <div className="fw-semibold mb-2">Minimum Age</div>
              <Form.Control
                type="number"
                className="w-auto"
                value={values?.minimum_age ?? 0}
                onChange={(e) => {
                  setValues({
                    ...values,
                    minimum_age: e.target?.value ? parseInt(e.target?.value) : 0,
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <div className="fw-semibold mb-2">Maximum Age</div>
              <Form.Control
                type="number"
                className="w-auto"
                value={values?.maximum_age ?? 0}
                onChange={(e) => {
                  setValues({
                    ...values,
                    maximum_age: e.target?.value ? parseInt(e.target?.value) : 0,
                  });
                }}
              />
            </div>
            <div className="mb-3 w-50">
              <div className="fw-semibold mb-2">Allowed Countries</div>
              <AesirXSelect
                isMulti={true}
                options={countryOptions}
                value={countryOptions?.filter((opt) =>
                  values?.allowed_countries?.includes(opt.value)
                )}
                placeholder="Select countries"
                className="shadow-none border w-auto"
                onChange={(data) => {
                  setValues({ ...values, allowed_countries: data?.map((d) => d.value) ?? [] });
                }}
                minWidth={120}
              />
            </div>
            <div className="mb-3 w-50">
              <div className="fw-semibold mb-2">Disallowed Countries</div>
              <AesirXSelect
                isMulti={true}
                options={countryOptions}
                value={countryOptions?.filter((opt) =>
                  values?.disallowed_countries?.includes(opt.value)
                )}
                placeholder="Select countries"
                className="shadow-none border w-auto"
                onChange={(data) => {
                  setValues({ ...values, disallowed_countries: data?.map((d) => d.value) ?? [] });
                }}
                minWidth={120}
              />
            </div>
          </Form.Group>
        </Col>
        <Col lg={6} className="pe-5">
          <h4 className="fw-bold mb-8px">Message preview</h4>
          <div className="aesirx_consent_verify_preview_container">
            <div className="aesirx_consent_verify_preview">
              <div className="header">
                <img
                  className="back_icon_verify"
                  width="36px"
                  height="36px"
                  src={env.PUBLIC_URL + '/assets/images/back_icon.png'}
                />
                <div className="heading">
                  <span
                    className={`age_country_title ${
                      showPreview === 'age-country' || showPreview === 'default' ? 'active' : ''
                    }`}
                  >
                    Age & Country Verification
                  </span>
                  <span className={`age_title ${showPreview === 'age' ? 'active' : ''}`}>
                    Age Verification
                  </span>
                  <span className={`country_title ${showPreview === 'country' ? 'active' : ''}`}>
                    Country Verification
                  </span>
                </div>
              </div>
              <div className="body">
                <div
                  className={`check_line minimum_age_line ${
                    values?.age_check && values?.minimum_age ? '' : 'hide'
                  }`}
                >
                  <img
                    className="check_radio"
                    width="14px"
                    height="14px"
                    src={env.PUBLIC_URL + '/assets/images/check_radio.png'}
                  />
                  <div>
                    You must be at least{' '}
                    <span className="minimum_age_text">
                      {values?.minimum_age ? values?.minimum_age : '[Minimum Age]'}
                    </span>{' '}
                    years old to access this content.
                  </div>
                </div>
                <div
                  className={`check_line maximum_age_line ${
                    values?.age_check && values?.maximum_age ? '' : 'hide'
                  }`}
                >
                  <img
                    className="check_radio"
                    width="14px"
                    height="14px"
                    src={env.PUBLIC_URL + '/assets/images/check_radio.png'}
                  />
                  <div>
                    Access is limited to users under{' '}
                    <span className="maximum_age_text">
                      {values?.maximum_age ? values?.maximum_age : '[Maximum Age]'}
                    </span>{' '}
                    years.
                  </div>
                </div>
                <div
                  className={`check_line allow_country_line ${
                    values?.country_check && values?.allowed_countries?.length ? '' : 'hide'
                  }`}
                >
                  <img
                    className="check_radio"
                    width="14px"
                    height="14px"
                    src={env.PUBLIC_URL + '/assets/images/check_radio.png'}
                  />
                  <div>
                    To access this content, you must be from{' '}
                    <span className="allow_country_text">
                      {values?.allowed_countries?.map((country) => country).join(', ')}
                    </span>
                    .
                  </div>
                </div>
                <div
                  className={`check_line disallow_country_line  ${
                    values?.country_check && values?.disallowed_countries?.length ? '' : 'hide'
                  }`}
                >
                  <img
                    className="check_radio"
                    width="14px"
                    height="14px"
                    src={env.PUBLIC_URL + '/assets/images/check_radio.png'}
                  />
                  <div>
                    Access is excluded to users from{' '}
                    <span className="disallow_country_text">
                      {values?.disallowed_countries?.map((country) => country).join(', ')}
                    </span>
                    .
                  </div>
                </div>
                <div className="check_line">
                  <img
                    className="check_radio"
                    width="14px"
                    height="14px"
                    src={env.PUBLIC_URL + '/assets/images/check_radio.png'}
                  />
                  <div>
                    To comply with the law, we need to verify your{' '}
                    <span
                      className={`${
                        showPreview === 'default' ? 'updateable' : ''
                      } age_country_text`}
                    >
                      {showPreview === 'age-country'
                        ? 'age & country'
                        : showPreview === 'age'
                        ? 'age'
                        : showPreview === 'country'
                        ? 'country'
                        : '[age] / [country] / [age & country]'}
                    </span>{' '}
                    before granting you access.
                  </div>
                </div>
                <div className="check_line">
                  <img
                    className="check_radio"
                    width="14px"
                    height="14px"
                    src={env.PUBLIC_URL + '/assets/images/check_radio.png'}
                  />
                  <div>
                    Verification is done using your digital ID stored in a secure wallet of your
                    choice – your personal details are encrypted & never stored or shared. If you
                    don’t have a wallet ID, you can create one now.
                  </div>
                </div>
              </div>
              <div className="footer">
                <div>
                  <div className="btn_light">Cancel</div>
                </div>
                <div>
                  <div className="btn_success">Continue to Verification</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default IDVerification;
