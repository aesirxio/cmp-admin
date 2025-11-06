import React, { useEffect, useState } from 'react';
import { useConsentsLogicViewModel } from './ConsentsLogicViewModels/ConsentsLogicViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { PAGE_STATUS } from 'aesirx-uikit';

const ConsentsLogic = observer(() => {
  const {
    consentsList: { initialize, updateConsentsLogic, consentsLogic, statusUpdateConsentsLogic },
  } = useConsentsLogicViewModel();
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
    gpc_consent: 'opt-in',
    gpc_consent_donotsell: 'yes',
    gpc_support: 'yes',
  });

  useEffect(() => {
    consentsLogic?.domain &&
      setValues({
        ...values,
        domain: consentsLogic?.domain,
        ...(consentsLogic?.gpc_consent ? { gpc_consent: consentsLogic?.gpc_consent } : {}),
        ...(consentsLogic?.gpc_consent_donotsell
          ? { gpc_consent_donotsell: consentsLogic?.gpc_consent_donotsell }
          : {}),
        ...(consentsLogic?.gpc_support ? { gpc_support: consentsLogic?.gpc_support } : {}),
      });
  }, [consentsLogic]);

  const handleSubmit = async () => {
    if (values) {
      await updateConsentsLogic(values);
    }
  };

  const generateGpcJson = () => {
    const policyUrl = `https://${activeDomain[0]}/privacy-policy`;

    const gpcData = {
      gpc: true,
      policy_url: policyUrl,
    };

    return JSON.stringify(gpcData, null, 2);
  };

  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">Consent Logic</h2>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          {statusUpdateConsentsLogic === PAGE_STATUS.LOADING && (
            <Spinner size="sm" className="me-2" />
          )}
          Save
        </Button>
      </div>
      <Form.Group className="mb-3" controlId="formConsentLogic">
        <Row>
          <Col lg="2">
            <div className="fw-semibold">Configurable Consent Logic</div>
          </Col>
          <Col lg="5">
            <div className="d-flex align-items-start">
              <Form.Check
                inline
                onChange={() => {
                  setValues({ ...values, gpc_consent: 'opt-in' });
                }}
                checked={values?.gpc_consent === 'opt-in'}
                value={`opt-in`}
                name="gpc_consent"
                type="radio"
                id={`inline-radio-opt-in`}
              />
              <Form.Label for="inline-radio-opt-in">
                <div className="mb-2">Opt-In Mode (EU)</div>
                <div className="text-gray-600 fs-14">
                  No tracking technologies are activated until a user explicitly gives consent. This
                  is required by <span className="fw-semibold">GDPR</span> and{' '}
                  <span className="fw-semibold">ePrivacy Directive 5(3)</span>.
                </div>
              </Form.Label>
            </div>
          </Col>
          <Col lg="5">
            <div className="d-flex align-items-start">
              <Form.Check
                inline
                onChange={() => {
                  setValues({ ...values, gpc_consent: 'opt-out' });
                }}
                checked={values?.gpc_consent === 'opt-out'}
                value={`opt-out`}
                name="gpc_consent"
                type="radio"
                id={`inline-radio-opt-out`}
              />
              <Form.Label for="inline-radio-opt-out">
                <div className="mb-2">Opt-Out Mode (California)</div>
                <div className="text-gray-600 fs-14">
                  Tracking is allowed by default, but users must be able to opt out easily. This
                  aligns with CCPA and similar U.S. privacy frameworks.
                </div>
              </Form.Label>
            </div>
          </Col>
        </Row>
        {values?.gpc_consent === 'opt-out' ? (
          <Row className="mt-4">
            <Col lg="2">
              <div className="fw-semibold">Do not sell or share options</div>
            </Col>
            <Col lg="10">
              <Row>
                <Col lg="4">
                  <div className="d-flex align-items-start">
                    <Form.Check
                      inline
                      onChange={() => {
                        setValues({ ...values, gpc_consent_donotsell: 'yes' });
                      }}
                      checked={values?.gpc_consent_donotsell === 'yes'}
                      value={`yes`}
                      name="gpc_consent_donotsell"
                      type="radio"
                      id={`inline-radio-gpc-consent-donotsell-yes`}
                    />
                    <Form.Label for="inline-radio-gpc-consent-donotsell-yes">
                      <div className="mb-2">Yes</div>
                    </Form.Label>
                  </div>
                </Col>
                <Col lg="4">
                  <div className="d-flex align-items-start">
                    <Form.Check
                      inline
                      onChange={() => {
                        setValues({ ...values, gpc_consent_donotsell: 'no' });
                      }}
                      checked={values?.gpc_consent_donotsell === 'no'}
                      value={`no`}
                      name="gpc_consent_donotsell"
                      type="radio"
                      id={`inline-radio-gpc-consent-donotsell-no`}
                    />
                    <Form.Label for="inline-radio-gpc-consent-donotsell-no">
                      <div className="mb-2">No</div>
                    </Form.Label>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <></>
        )}

        <Row className="mt-4">
          <Col lg="2">
            <div className="fw-semibold">GPC Compliance</div>
          </Col>
          <Col lg="10">
            <Row>
              <Col lg="4">
                <div className="d-flex align-items-start">
                  <Form.Check
                    inline
                    onChange={() => {
                      setValues({ ...values, gpc_support: 'yes' });
                    }}
                    checked={values?.gpc_support === 'yes'}
                    value={`yes`}
                    name="gpc_support"
                    type="radio"
                    id={`inline-radio-gpc-support-yes`}
                  />
                  <Form.Label for="inline-radio-gpc-support-yes">
                    <div className="mb-2">Enable GPC Support</div>
                  </Form.Label>
                </div>
              </Col>
              <Col lg="4">
                <div className="d-flex align-items-start">
                  <Form.Check
                    inline
                    onChange={() => {
                      setValues({ ...values, gpc_support: 'no' });
                    }}
                    checked={values?.gpc_support === 'no'}
                    value={`no`}
                    name="gpc_support"
                    type="radio"
                    id={`inline-radio-gpc-support-no`}
                  />
                  <Form.Label for="inline-radio-gpc-support-no">
                    <div className="mb-2">Disable GPC Support</div>
                  </Form.Label>
                </div>
              </Col>
              <Col lg="12">
                <div className="text-gray-600 fs-14 mb-2">
                  To comply with Global Privacy Control (GPC), please download and upload the
                  following file:
                </div>
                <div className="example-content code text-black">
                  {`{
      "gpc": true,
      "policy_url": "https://${activeDomain[0]}/privacy-policy"
}`}
                </div>
                <div className="download-button mt-2">
                  <a
                    href={
                      'data:application/json;charset=utf-8,' + encodeURIComponent(generateGpcJson())
                    }
                    download="gpc.json"
                    className="btn btn-success mb-3"
                  >
                    Download gpc.json
                  </a>
                </div>
                <p className="mb-2">Upload Instructions:</p>
                <ul>
                  <li>Download the gpc.json file.</li>
                  <li>Connect to your website via FTP or File Manager.</li>
                  <li>
                    Upload the file to: <code>/public_html/.well-known/gpc.json</code>
                  </li>
                  <li>
                    Ensure the file is accessible by visiting:{' '}
                    <a
                      href={`https://${activeDomain[0]}/.well-known/gpc.json`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      https://{activeDomain[0]}/.well-known/gpc.json
                    </a>
                  </li>
                </ul>
                <h5 className="fw-semibold mb-2">Privacy Policy Update</h5>
                <p className="text-gray-600 fs-14 mb-2">
                  You must update your Privacy Policy to reflect GPC compliance. Below is a
                  suggested update:
                </p>
                <div className="example-content text-black">
                  <div>Global Privacy Control (GPC)</div> Compliance Our website respects the Global
                  Privacy Control (GPC) signal. If your browser sends a GPC signal, we automatically
                  disable non-essential cookies and opt you out of data sharing. For more details,
                  please visit our Privacy Policy: https://{activeDomain[0]}/privacy-policy.
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
});

export default ConsentsLogic;
