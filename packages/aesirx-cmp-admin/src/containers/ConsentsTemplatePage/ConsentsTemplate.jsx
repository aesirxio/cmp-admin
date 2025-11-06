import React, { useEffect, useState } from 'react';
import { useConsentsTemplateViewModel } from './ConsentsTemplateViewModels/ConsentsTemplateViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Image, PAGE_STATUS, notify, FormEditor } from 'aesirx-uikit';
import { env } from 'aesirx-lib';

const ConsentsTemplate = observer(() => {
  const {
    consentsList: {
      initialize,
      updateConsentsTemplate,
      consentsTemplate,
      statusUpdateConsentsTemplate,
    },
  } = useConsentsTemplateViewModel();
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
    template: '',
  });

  const [defaulConsentText, setDefaulConsentText] = useState();
  const [defaulConsentCookie, setDefaulConsentCookie] = useState();
  const [defaulConsentDetail, setDefaulConsentDetail] = useState();
  const [defaulConsentReject, setDefaulConsentReject] = useState();

  useEffect(() => {
    consentsTemplate?.domain &&
      setValues({
        ...values,
        domain: consentsTemplate?.domain,
        ...(consentsTemplate?.template ? { template: consentsTemplate?.template } : {}),
        ...(consentsTemplate?.consent_text ? { consent_text: consentsTemplate?.consent_text } : {}),
        ...(consentsTemplate?.consent_detail
          ? { consent_detail: consentsTemplate?.consent_detail }
          : {}),
        ...(consentsTemplate?.consent_reject
          ? { consent_reject: consentsTemplate?.consent_reject }
          : {}),
        ...(consentsTemplate?.consent_cookie
          ? { consent_cookie: consentsTemplate?.consent_cookie }
          : {}),
      });
    if (consentsTemplate && !consentsTemplate?.consent_text) {
      updateDefaultConsentText(consentsTemplate?.template);
    }
    if (consentsTemplate && !consentsTemplate?.consent_detail) {
      updateDefaultConsentDetail(consentsTemplate?.template);
    }
    if (consentsTemplate && !consentsTemplate?.consent_reject) {
      updateDefaultConsentReject();
    }
  }, [consentsTemplate]);
  const handleChange = (name) => {
    setValues({ ...values, domain: activeDomain[0], template: name });
  };
  const handleSubmit = async () => {
    if (values?.template) {
      await updateConsentsTemplate(values);
    } else {
      notify('Please choose template', 'error');
    }
  };
  const updateDefaultConsentText = (template) => {
    const text = `
    <p class="mt-0 mb-1 mb-lg-2 text-black fw-semibold">
      Manage Your Consent Preferences
    </p>
    <p class="mt-0 mb-1 mb-lg-3">
     ${
       template === 'simple-consent-mode'
         ? `Choose how we use your data: “Reject” data collection, allow tracking [“Consent”].`
         : `Choose how we use your data: “Reject” data collection, allow tracking [“Consent”], or use “Decentralized Consent” for more control over your personal data & rewards.`
     }
    </p>
    <div class="mb-1 mb-lg-3">
      <p class="mb-1 mb-lg-2 text-black">
        By consenting, you allow us to collect & use your data for:
      </p>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>Analytics & Behavioral Data: To improve our services & personalize your experience.</div>
        </div>
      </div>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>Form Data: When you contact us.</div>
        </div>
      </div>
    </div>
    <div>
      <p class="mb-1 mb-lg-2 text-black">Please note</p>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>We do not share your data with third parties without your explicit consent.</div>
        </div>
      </div>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>You can opt-in later for specific features without giving blanket consent.</div>
        </div>
      </div>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          For more details, refer to our <a class='text-success fw-semibold text-decoration-underline' href='https://aesirx.io/privacy-policy' target='_blank'>privacy policy.</a>
        </div>
      </div>
    </div>`;
    setDefaulConsentText(text);
  };
  const updateDefaultConsentCookie = () => {
    const text = ``;
    setDefaulConsentCookie(text);
  };
  const updateDefaultConsentDetail = (template) => {
    const textDetail = `
  <p class="mt-0 mb-1 mb-lg-2 text-black fw-semibold">
    Manage Your Consent Preferences
  </p>
  <p class="mt-0 mb-1 mb-lg-3">
    ${
      template === 'simple-consent-mode'
        ? `Choose how we use your data: "Reject" data collection, allow tracking ["Consent"].`
        : `Choose how we use your data: "Reject" data collection, allow tracking ["Consent"], or use "Decentralized Consent" for more control over your personal data & rewards.`
    }
  </p>
  <div class="mb-1 mb-lg-3">
    <p class="mb-1 mb-lg-2 text-black fw-semibold">
      Benefits
    </p>
    <div class="d-flex align-items-start check-line">
      <span><img src="${
        env.PUBLIC_URL + '/assets/images/check_circle.svg'
      }" width={'14px'} height={'15px'} /></span>
      <div class="ms-10px">
        <span class='fw-semibold text-primary'>Control your data:</span> Choose your preferred level of data collection & tracking.
      </div>
    </div>
    <div class="d-flex align-items-start check-line">
      <span><img src="${
        env.PUBLIC_URL + '/assets/images/check_circle.svg'
      }" width={'14px'} height={'15px'} /></span>
      <div class="ms-10px">
        <span class='fw-semibold text-primary'>Transparent data collection practices:</span> Understand how your data is collected & used.
      </div>
    </div>
  </div>
  <div class="mb-1 mb-lg-3">
    <p class="mb-1 mb-lg-2 text-black fw-semibold">
      Understanding Your Privacy Choices
    </p>
    <div class="d-flex align-items-start check-line">
      <span><img src="${
        env.PUBLIC_URL + '/assets/images/check_circle.svg'
      }" width={'14px'} height={'15px'} /></span>
      <div class="ms-10px">
        <span class='fw-semibold text-primary'>Reject:</span> No data will be collected or loaded except for anonymized page views & rejections. Some personalization features may be disabled.
      </div>
    </div>
    <div class="d-flex align-items-start check-line">
      <span><img src="${
        env.PUBLIC_URL + '/assets/images/check_circle.svg'
      }" width={'14px'} height={'15px'} /></span>
      <div class="ms-10px">
        <span class='fw-semibold text-primary'>Consent:</span> First & third-party tracking data will be collected to enhance your experience.
      </div>
    </div>
    ${
      template === 'simple-consent-mode'
        ? ``
        : `
        <div class="d-flex align-items-start check-line">
          <span><img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} /></span>
          <div class="ms-10px">
            <span class='fw-semibold text-primary'>Decentralized Consent:</span> Choose Decentralized Wallets or Decentralized Wallet + Shield of Privacy. Both options let you manage & revoke consent on-site or through AesirX dApp, plus earn rewards from digital marketing activities.
          </div>
        </div>
        `
    }
  </div>
  `;
    setDefaulConsentDetail(textDetail);
  };
  const updateDefaultConsentReject = () => {
    const textReject = `
  <p class="mt-0 pt-4 mb-2">
    You've chosen to reject data collection:
  </p>
  <p class="mt-2 mb-3">
    Only anonymized page views & limited features will be available. To access all website features, including personalized content & enhanced functionality, please choose an option:
  </p>
  <div class="d-flex align-items-start check-line">
    <span><img src="${
      env.PUBLIC_URL + '/assets/images/check_circle.svg'
    }" width={'14px'} height={'15px'} /></span>
    <div class="ms-10px">
      <span class='fw-semibold text-primary'>Consent:</span> Allow data collection for analytics, form data (when you contact us), & behavioral & event tracking, with the option to opt-in for specific features.
    </div>
  </div>
  <div class="d-flex align-items-start check-line">
    <span><img src="${
      env.PUBLIC_URL + '/assets/images/check_circle.svg'
    }" width={'14px'} height={'15px'} /></span>
    <div class="ms-10px">
      <span class='fw-semibold text-primary'>Decentralized Consent:</span> Allow data collection for analytics, form data (when you contact us), & behavioral & event tracking, with the option to revoke consent, opt-in for specific features, & earn rewards from digital marketing activities.
    </div>
  </div>`;
    setDefaulConsentReject(textReject);
  };
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">Consent Modal</h2>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          {statusUpdateConsentsTemplate === PAGE_STATUS.LOADING && (
            <Spinner size="sm" className="me-2" />
          )}
          Save
        </Button>
      </div>
      <Form.Group className="mb-3">
        <div className="fw-semibold w-100 mt-4 mb-2">
          Choose your tailored template for {activeDomain[0]}
        </div>
        <Row>
          <Col lg="5" className="mb-3">
            <label
              className="d-flex justify-content-start flex-column h-100"
              htmlFor="inline-radio-simple"
            >
              <div className="border rounded-2 shadow-sm mb-4">
                <Image
                  className={`w-100`}
                  src={`${env.PUBLIC_URL}/assets/images/consent_simple_mode.png`}
                  alt={'icons'}
                />
              </div>
              <Form.Check
                inline
                label={`Default Consent Mode`}
                onChange={() => {
                  handleChange('simple-consent-mode');
                }}
                checked={values?.template === 'simple-consent-mode' || !values?.template}
                value={`simple-consent-mode`}
                name="group1"
                type="radio"
                id={`inline-radio-simple`}
              />
              <p className="mt-3 fs-sm">
                Default Consent Mode improves Google Consent Mode 2.0 by not loading any tags until
                after consent is given, reducing compliance risks.
              </p>
            </label>
          </Col>
          <Col lg="5" className="mb-3">
            <label
              className="d-flex justify-content-start flex-column h-100"
              htmlFor="inline-radio-default"
            >
              <div className="border rounded-2 shadow-sm mb-3">
                <Image
                  className={`w-100`}
                  src={`${env.PUBLIC_URL}/assets/images/consent_default.png`}
                  alt={'icons'}
                />
              </div>
              <Form.Check
                inline
                label={`Decentralized Consent Mode`}
                onChange={() => {
                  handleChange('default');
                }}
                checked={values?.template === 'default'}
                value={`default`}
                name="group1"
                type="radio"
                id={`inline-radio-default`}
              />
              <p className="mt-3 fs-sm">
                Decentralized Consent Mode setup improves Google Consent Mode 2.0 by not loading any
                scripts, beacons, or tags until after consent is given, reducing compliance risks.
                It also includes Decentralized Consent, for more control over personal data.
              </p>
            </label>
          </Col>
        </Row>
        <div className="my-4">
          <div className="mb-2 fw-semibold w-100">Customize Consent Management Text</div>
          <div key={defaulConsentText} className="editor_template">
            <FormEditor
              field={{
                getValueSelected: values?.consent_text
                  ? values?.consent_text
                  : defaulConsentText ?? '',
                handleChange: (data) => {
                  if (values?.template) {
                    setValues({ ...values, consent_text: data ?? '' });
                  }
                },
              }}
            />
            <p className="mt-2 fst-italic">
              {`Always link your own website's Privacy Policy, not the AesirX example`}
            </p>
            <Button
              className="btn btn-success-light my-2 d-flex align-items-center"
              onClick={() => {
                updateDefaultConsentText(values?.template);
              }}
            >
              <img
                width="20px"
                height="20px"
                className="me-1"
                src={env.PUBLIC_URL + '/assets/images/reset_icon.png'}
              />
              Reset Consent
            </Button>
          </div>
        </div>
        <div className="my-4">
          <div className="mb-2 fw-semibold w-100">Customize Cookie Declaration Text</div>
          <div key={defaulConsentCookie} className="editor_template">
            <FormEditor
              field={{
                getValueSelected: values?.consent_cookie
                  ? values?.consent_cookie
                  : defaulConsentCookie ?? '',
                handleChange: (data) => {
                  if (values?.template) {
                    setValues({ ...values, consent_cookie: data ?? '' });
                  }
                },
              }}
            />
            <Button
              className="btn btn-success-light my-2 d-flex align-items-center"
              onClick={() => {
                updateDefaultConsentCookie(values?.template);
              }}
            >
              <img
                width="20px"
                height="20px"
                className="me-1"
                src={env.PUBLIC_URL + '/assets/images/reset_icon.png'}
              />
              Reset Cookie
            </Button>
          </div>
        </div>
        <div className="my-4">
          <div className="mb-2 fw-semibold w-100">Customize Details Text</div>
          <div key={defaulConsentDetail} className="editor_template">
            <FormEditor
              field={{
                getValueSelected: values?.consent_detail
                  ? values?.consent_detail
                  : defaulConsentDetail ?? '',
                handleChange: (data) => {
                  if (values?.template) {
                    setValues({ ...values, consent_detail: data ?? '' });
                  }
                },
              }}
            />
            <Button
              className="btn btn-success-light my-2 d-flex align-items-center"
              onClick={() => {
                updateDefaultConsentDetail(values?.template);
              }}
            >
              <img
                width="20px"
                height="20px"
                className="me-1"
                src={env.PUBLIC_URL + '/assets/images/reset_icon.png'}
              />
              Reset Detail
            </Button>
          </div>
        </div>
        <div className="my-4">
          <div className="mb-2 fw-semibold w-100">Customize Reject Text</div>
          <div key={defaulConsentReject} className="editor_template">
            <FormEditor
              field={{
                getValueSelected: values?.consent_reject
                  ? values?.consent_reject
                  : defaulConsentReject ?? '',
                handleChange: (data) => {
                  if (values?.template) {
                    setValues({ ...values, consent_reject: data ?? '' });
                  }
                },
              }}
            />
            <Button
              className="btn btn-success-light my-2 d-flex align-items-center"
              onClick={() => {
                updateDefaultConsentReject(values?.template);
              }}
            >
              <img
                width="20px"
                height="20px"
                className="me-1"
                src={env.PUBLIC_URL + '/assets/images/reset_icon.png'}
              />
              Reset Reject
            </Button>
          </div>
        </div>
      </Form.Group>
    </div>
  );
});

export default ConsentsTemplate;
