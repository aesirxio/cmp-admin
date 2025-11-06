import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsentsShieldViewModel } from './ConsentsShieldViewModels/ConsentsShieldViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { PAGE_STATUS } from 'aesirx-uikit';
import { env } from 'aesirx-lib';
import axios from 'axios';

const ConsentsShield = observer(() => {
  const { t } = useTranslation();
  const {
    consentsList: { initialize, updateConsentsShield, consentsShield, statusUpdateConsentsShield },
  } = useConsentsShieldViewModel();
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
    client_id: '',
    client_secret: '',
    license_key: '',
    gtag_id: '',
    gtm_id: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const saveLicense = async (params) => {
    try {
      await updateConsentsShield(params, false);
    } catch (err) {
      console.error('Save license failed:', err);
    }
  };

  const fetchJson = async (url) => {
    const res = await axios.get(url);
    return res.data;
  };

  const checkLicense = async (license_key) => {
    try {
      const url = `https://api.aesirx.io/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=validateWPLicense&api=hal&license=${license_key}`;
      const res = await fetchJson(url);
      const result = res?.result || {};

      const decodedDomains = result.domain_list?.decoded || [];
      const domainList = decodedDomains.map((d) => d.domain.replace(/^www\./, ''));

      // Save AI key info via backend
      const openAIKey = {
        openai_key: result.openai_key || '',
        openai_assistant: result.openai_assistant || '',
      };

      // --- License Validation ---
      if (!result.success || result.subscription_product !== 'product-aesirx-cmp') {
        await saveLicense({ domain: activeDomain[0], is_cmp_license_valid: false, ...openAIKey });
        setMessage(
          `Your license is expired or not found. Please update new license at <a href='https://aesirx.io/licenses' target='_blank'>aesirx.io/licenses</a>.`
        );
      } else if (!domainList.includes(activeDomain[0])) {
        await saveLicense({
          domain: activeDomain[0],
          is_cmp_license_valid: false,
          ...openAIKey,
        });
        setMessage(
          `Your domain doesn't match your license. Please update your domain at <a href='https://aesirx.io/licenses' target='_blank'>aesirx.io/licenses</a> and click <span class='expired_date'>here</span> to verify again.`
        );
      } else {
        const dateExpired = new Date(result.date_expired.replace(' ', 'T') + 'Z');
        const now = new Date();
        const diff = dateExpired - now;

        await saveLicense({
          domain: activeDomain[0],
          is_cmp_license_valid: diff <= 0 ? false : true,
          expired_date: dateExpired.getTime(),
          ...openAIKey,
        });

        if (diff <= 0) {
          setMessage(
            `Your license has expired. Please renew at <a href='https://aesirx.io/licenses' target='_blank'>aesirx.io/licenses</a>.`
          );
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          if (days > 730) {
            setMessage('You are using a lifetime license.');
          } else {
            const years = Math.floor(days / 365);
            const months = Math.floor((days % 365) / 30);
            const d = days % 30;
            const parts = [];
            if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
            if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
            if (d || parts.length === 0) parts.push(`${d} day${d > 1 ? 's' : ''}`);
            const timeLeft = parts.join(', ');
            setMessage(
              `Your license ends in ${timeLeft}. Please update your license <a href='https://aesirx.io/licenses' target='_blank'>here</a>.`
            );
          }
        }
      }
      setLoading(false);
    } catch (err) {
      setMessage(
        `Check license failed: ${err.message}. Please contact support or update your license.`
      );
      setLoading(false);
    }
  };

  const checkTrial = async () => {
    try {
      const url = `https://api.aesirx.io/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=validateWPDomain&api=hal&domain=${encodeURIComponent(
        activeDomain[0]
      )}`;
      const res = await fetchJson(url);
      const result = res?.result || {};

      if (result.success) {
        const dateExpired = new Date(result.date_expired);
        const now = new Date();
        const diff = dateExpired - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (days === 0) {
          setMessage(
            `Your trial license ends in ${hours} hour(s). Please update your license <a href='https://aesirx.io/licenses' target='_blank'>here</a>.`
          );
        } else if (days > 730) {
          setMessage('You are using a lifetime license.');
        } else {
          const years = Math.floor(days / 365);
          const months = Math.floor((days % 365) / 30);
          const d = days % 30;
          const parts = [];
          if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
          if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
          if (d || parts.length === 0) parts.push(`${d} day${d > 1 ? 's' : ''}`);
          const timeLeft = parts.join(', ');
          setMessage(
            `Your trial license ends in ${timeLeft}. Please update your license <a href='https://aesirx.io/licenses' target='_blank'>here</a>.`
          );
        }
        if (consentsShield?.expired_date !== dateExpired.getTime()) {
          await saveLicense({
            domain: activeDomain[0],
            is_cmp_license_valid: true,
            expired_date: dateExpired.getTime(),
          });
        }
      } else if (result.date_expired) {
        const dateExpired = new Date(result.date_expired);
        setMessage(
          `Your free trial has ended. Please update your license <a href='https://aesirx.io/licenses' target='_blank'>here</a>.`
        );
        if (consentsShield?.expired_date !== dateExpired?.getTime()) {
          await saveLicense({
            domain: activeDomain[0],
            is_cmp_license_valid: false,
            openai_key: '',
            openai_assistant: '',
          });
        }
      } else {
        await triggerTrial();
      }
      setLoading(false);
    } catch (err) {
      setMessage(`Trial check failed: ${err.message}`);
      setLoading(false);
    }
  };

  // --- Start Trial if not found ---
  const triggerTrial = async () => {
    try {
      const url =
        'https://api.aesirx.io/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=validateWPDomain&api=hal';
      const res = await axios.post(url, { domain: activeDomain[0] });
      const result = res?.data?.result || {};
      if (result.success) {
        const dateExpired = new Date(result.date_expired);
        const now = new Date();
        const diff = dateExpired - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setMessage(
          `Your trial license ends in ${days} days. Please update your license <a href='https://aesirx.io/licenses' target='_blank'>here</a>.`
        );
      }
    } catch (err) {
      setMessage(`Something went wrong: ${err.message}. Please contact the administrator.`);
    }
  };

  useEffect(() => {
    consentsShield?.domain &&
      setValues({
        ...values,
        domain: consentsShield?.domain,
        ...(consentsShield?.client_id ? { client_id: consentsShield?.client_id } : {}),
        ...(consentsShield?.client_secret ? { client_secret: consentsShield?.client_secret } : {}),
        ...(consentsShield?.license_key ? { license_key: consentsShield?.license_key } : {}),
        ...(consentsShield?.gtag_id ? { gtag_id: consentsShield?.gtag_id } : {}),
        ...(consentsShield?.gtm_id ? { gtm_id: consentsShield?.gtm_id } : {}),
      });
  }, [consentsShield]);

  useEffect(() => {
    if (!values?.license_key) {
      if (consentsShield?.license_key !== '') {
        if (consentsShield?.license_key) {
          checkLicense(consentsShield?.license_key);
        }
      } else {
        if (!consentsShield?.license_key) {
          checkTrial();
        }
      }
    }
  }, [consentsShield?.license_key]);

  const handleSubmit = async () => {
    if (values) {
      await updateConsentsShield(values);
      values?.license_key && checkLicense(values?.license_key);
    }
  };

  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">Configuration</h2>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          {statusUpdateConsentsShield === PAGE_STATUS.LOADING && (
            <Spinner size="sm" className="me-2" />
          )}
          Save
        </Button>
      </div>
      <Form.Group className="mb-3">
        <Row>
          <Col lg={9}>
            <div className="bg-white rounded-3 p-2 h-100">
              <Row className="mb-3">
                <Col lg="4">
                  <label className="mb-2 fw-semibold">Your Client ID *</label>
                  <Form.Control
                    type="text"
                    placeholder={`SSO Client ID`}
                    value={values?.client_id ?? ''}
                    onChange={(e) => {
                      setValues({ ...values, client_id: e.target?.value });
                    }}
                  />
                </Col>
                <Col lg="4">
                  <label className="mb-2 fw-semibold">Your Client Secret *</label>
                  <Form.Control
                    type="text"
                    placeholder={`SSO Client Secret`}
                    value={values?.client_secret ?? ''}
                    onChange={(e) => {
                      setValues({ ...values, client_secret: e.target?.value });
                    }}
                  />
                </Col>
                <Col lg="4">
                  <label className="mb-2 fw-semibold">Your License Key</label>
                  <Form.Control
                    type="text"
                    placeholder={`License Key`}
                    value={values?.license_key ?? ''}
                    onChange={(e) => {
                      setValues({ ...values, license_key: e.target?.value });
                    }}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col lg="4">
                  <label className="mb-2 fw-semibold">Gtag ID</label>
                  <Form.Control
                    type="text"
                    placeholder={`${t('txt_input_gtag_id')}`}
                    value={values?.gtag_id ?? ''}
                    onChange={(e) => {
                      setValues({ ...values, gtag_id: e.target?.value });
                    }}
                  />
                </Col>
                <Col lg="4">
                  <label className="mb-2 fw-semibold">GTM ID</label>
                  <Form.Control
                    type="text"
                    placeholder={`${t('txt_input_gtm_id')}`}
                    value={values?.gtm_id ?? ''}
                    onChange={(e) => {
                      setValues({ ...values, gtm_id: e.target?.value });
                    }}
                  />
                </Col>
              </Row>
              <p className="d-flex align-items-center fs-14 text-gray-600">
                <img
                  width="20px"
                  height="20px"
                  className="me-1"
                  src={env.PUBLIC_URL + '/assets/images/question_icon.png'}
                ></img>
                To configure, input your Google Tag Manager Gtag ID & GTM ID in the designated
                fields. Once set up, Google Tag Manager will only load after the user provides
                consent.
              </p>
            </div>
          </Col>

          <Col lg={3}>
            <div className="bg-white rounded-3 p-4 h-100">
              <img
                width="255px"
                height="96px"
                className="mx-auto d-block mb-3"
                src={env.PUBLIC_URL + '/assets/images/banner_1.png'}
              ></img>
              <div className="license_information text-danger">
                {loading ? <Spinner size="sm" className="me-2" /> : <></>}
                <div dangerouslySetInnerHTML={{ __html: message }} />
              </div>
              <a
                className="btn btn-success rounded-3 w-100 mt-3"
                target="_blank"
                rel="noreferrer"
                href="https://aesirx.io/licenses"
              >
                Manage License Here
                <img
                  width="20px"
                  height="20px"
                  src={env.PUBLIC_URL + '/assets/images/external_link_icon.png'}
                />
              </a>
            </div>
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
});

export default ConsentsShield;
