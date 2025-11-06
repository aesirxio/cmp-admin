import React, { useEffect, useState } from 'react';
import { useGeoHandlingViewModel } from './GeoHandlingViewModels/GeoHandlingViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { PAGE_STATUS, AesirXSelect } from 'aesirx-uikit';
import { env } from 'aesirx-lib';
import { languages, timezones } from 'utils';

const GeoHandling = observer(() => {
  const {
    consentsList: { initialize, updateGeoHandling, geoHandling, statusUpdateGeoHandling },
  } = useGeoHandlingViewModel();
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

  const initialRules = Object.keys(languages).map((lang) => ({
    language: lang,
    timezone: '',
    logic: 'and',
    consent_mode: '',
    override_field: 'no',
  }));

  const [values, setValues] = useState({
    domain: activeDomain[0],
    geo_handling: 'yes',
    geo_rules: initialRules,
  });

  useEffect(() => {
    geoHandling?.domain &&
      setValues({
        ...values,
        domain: geoHandling?.domain,
        ...(geoHandling?.geo_handling ? { geo_handling: geoHandling?.geo_handling } : {}),
        ...(geoHandling?.geo_rules ? { geo_rules: geoHandling?.geo_rules } : {}),
      });
  }, [geoHandling]);

  const logics = { and: 'AND', or: 'OR' };
  const modes = { 'opt-in': 'Opt-In', 'opt-out': 'Opt-Out' };
  const overrides = { yes: 'Yes', no: 'No' };

  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...values.geo_rules];
    updatedRules[index][field] = value?.value;
    setValues({ ...values, geo_rules: updatedRules });
  };

  const addRule = () => {
    setValues({
      ...values,
      geo_handling: 'yes',
      geo_rules: [
        ...values.geo_rules,
        {
          language: '',
          timezone: '',
          logic: 'and',
          consent_mode: '',
          override_field: 'no',
        },
      ],
    });
  };

  const removeRule = (index) => {
    const updatedRules = values.geo_rules.filter((_, i) => i !== index);
    setValues({ ...values, geo_rules: updatedRules });
  };
  const toOptions = (obj) => Object.entries(obj).map(([value, label]) => ({ value, label }));
  const languageOptions = toOptions(languages);
  const timezoneOptions = toOptions(timezones);
  const logicOptions = toOptions(logics);
  const modeOptions = toOptions(modes);
  const overrideOptions = toOptions(overrides);

  const handleSubmit = async () => {
    console.log('values', values);
    if (values) {
      await updateGeoHandling(values);
    }
  };
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">Geo-Handling</h2>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          {statusUpdateGeoHandling === PAGE_STATUS.LOADING && (
            <Spinner size="sm" className="me-2" />
          )}
          Save
        </Button>
      </div>
      <Form.Group className="mb-3">
        <Row>
          <Col lg="2">
            <div className="fw-semibold">Enable Geo-handling for Consent Mode</div>
          </Col>
          <Col lg="3">
            <div className="d-flex align-items-start">
              <Form.Check
                inline
                onChange={() => {
                  setValues({ ...values, geo_handling: 'yes' });
                }}
                checked={values?.geo_handling === 'yes'}
                value={`yes`}
                name="geo_handling"
                type="radio"
                id={`inline-radio-yes`}
              />
              <Form.Label htmlFor="inline-radio-yes">
                <div className="mb-2">Yes</div>
              </Form.Label>
            </div>
          </Col>
          <Col lg="3">
            <div className="d-flex align-items-start">
              <Form.Check
                inline
                onChange={() => {
                  setValues({ ...values, geo_handling: 'no' });
                }}
                checked={values?.geo_handling === 'no'}
                value={`no`}
                name="geo_handling"
                type="radio"
                id={`inline-radio-no`}
              />
              <Form.Label htmlFor="inline-radio-no">
                <div className="mb-2">No</div>
              </Form.Label>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col lg="2">
            <div className="fw-semibold">Geo-Based Consent Rules</div>
          </Col>
          <Col lg="10">
            <div
              id="aesirx-consent-geo-rules"
              className="aesirx_consent_geo_rules_row bg-white p-2 rounded-2"
            >
              <div className="aesirx-consent-rule-header">
                <div>Browser Language</div>
                <div>Time Zone</div>
                <div className="aesirx_infor_wrapper">
                  AND / OR
                  <div className="input_information">
                    <img
                      width="20px"
                      height="20px"
                      src={env.PUBLIC_URL + '/assets/images/infor_icon.png'}
                    />
                    <div className="input_information_content xl">
                      <div>
                        Choose how browser language and time zone are combined to determine consent
                        rules:
                      </div>
                      <ul>
                        <li>
                          <strong>AND Logic (Stricter Match):</strong> Both language and time zone
                          must match a region for its consent model to apply. Ideal for
                          high-accuracy targeting.
                        </li>
                        <li>
                          <strong>OR Logic (More Flexible):</strong> Either language or time zone
                          can match to apply a region’s consent model. Best for broader coverage
                          based on user preferences.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="consent-mode">Consent Mode</div>
                <div>Allow Override</div>
                <div></div>
              </div>

              {values.geo_rules.map((rule, index) => (
                <div key={index} className="aesirx-consent-rule-row">
                  <div>
                    <AesirXSelect
                      options={languageOptions}
                      value={languageOptions.find((opt) => opt.value === rule.language)}
                      placeholder="-- Language --"
                      className="shadow-none border text-start"
                      onChange={(val) => handleRuleChange(index, 'language', val)}
                      minWidth={120}
                    />
                  </div>

                  <div>
                    <AesirXSelect
                      options={timezoneOptions}
                      value={timezoneOptions.find((opt) => opt.value === rule.timezone)}
                      placeholder="-- Time Zone --"
                      className="shadow-none border text-start"
                      onChange={(val) => handleRuleChange(index, 'timezone', val)}
                      minWidth={120}
                    />
                  </div>

                  <div>
                    <AesirXSelect
                      options={logicOptions}
                      value={logicOptions.find((opt) => opt.value === rule.logic)}
                      placeholder="'-- Logic --"
                      className="shadow-none border text-start"
                      onChange={(val) => handleRuleChange(index, 'logic', val)}
                      minWidth={120}
                    />
                  </div>

                  <div className="consent-mode">
                    <AesirXSelect
                      options={modeOptions}
                      value={modeOptions.find((opt) => opt.value === rule.consent_mode)}
                      placeholder="-- Consent Mode --"
                      className="shadow-none border text-start"
                      onChange={(val) => handleRuleChange(index, 'consent_mode', val)}
                      minWidth={180}
                    />
                  </div>

                  <div>
                    <AesirXSelect
                      options={overrideOptions}
                      value={overrideOptions.find((opt) => opt.value === rule.override_field)}
                      placeholder="-- Override --"
                      className="shadow-none border text-start"
                      onChange={(val) => handleRuleChange(index, 'override_field', val)}
                      minWidth={120}
                    />
                  </div>

                  <div>
                    <Button
                      className="btn btn-outline-danger aesirx-consent-remove-rules-row"
                      onClick={() => removeRule(index)}
                    >
                      <img
                        width="25px"
                        height="30px"
                        className="me-2"
                        src={env.PUBLIC_URL + '/assets/images/trash_icon.png'}
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div id="aesirx-consent-add-rules-row" className="mt-4">
              <Button
                variant=""
                className="btn bg-white rounded-2 d-flex align-items-center"
                onClick={addRule}
              >
                <img
                  width="23px"
                  height="30px"
                  className="me-2"
                  src={env.PUBLIC_URL + '/assets/images/plus_icon_green.png'}
                />{' '}
                Add New Rule
              </Button>
            </div>
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
});

export default GeoHandling;
