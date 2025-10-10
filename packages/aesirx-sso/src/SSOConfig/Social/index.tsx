import React from 'react';
import { Image } from '../../components/Image';
import { Button, Form, Spinner } from 'react-bootstrap';
import ButtonCopy from '../../components/ButtonCopy';
import { useState } from 'react';
import axios from 'axios';
import { notify } from '../../components/Toast';
import logo_google from '../../SSOButton/images/logo_google.svg';
import logo_twitter from '../../SSOButton/images/logo_twitter.svg';
import logo_facebook from '../../SSOButton/images/logo_facebook.svg';
import { useUserContext } from '../../SSOButton/Providers/user';
import { useGlobalContext } from '../../SSOButton/Providers/global';
import { updateMember } from '../../utils/index';
import { getClientApp } from '../../utils';
const Social = ({ typeSocial, keySocial }: any) => {
  const [loading, setLoading] = useState(false);
  const { aesirxData, getData } = useUserContext();
  const { accessToken, jwt } = useGlobalContext();
  const { endpoint } = getClientApp();

  const connectSocial = async () => {
    try {
      setLoading(true);
      const response: any = await axios.get(
        `${endpoint}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=getSocialConnectUrl&api=hal&socialType=${typeSocial}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        }
      );

      const popupSocial =
        response?.data.result[0] &&
        window.open(response?.data.result[0], 'SSO', 'status=1,height=750,width=650');
      const timer = setInterval(function () {
        if (popupSocial?.closed) {
          clearInterval(timer);
          setLoading(false);
        }
      }, 1000);

      window.addEventListener(
        'message',
        (e: any) => {
          if (e.origin !== endpoint) return;
          if (e.data && e.data.socialType) {
            setLoading(false);
            getData(jwt, accessToken);
          } else if (e.data.error) {
            notify(`${e.data.error}`, 'error');
          }
        },
        false
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const disconnectSocial = async () => {
    let updateSuccess = true;
    setLoading(true);
    try {
      const response: any = await updateMember(
        { id: aesirxData?.member_id, [keySocial]: '' },
        accessToken
      );

      if (response?.result?.success) {
        notify('Disconnect sucessfully!', 'success');
      } else {
        updateSuccess = false;
        notify(`${response?._messages?.[0]?.message || 'Something when wrong!'}`, 'error');
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('Error', error);
      updateSuccess = false;
      notify(`${error?.response?.data?._messages?.[0]?.message || error?.message}`, 'error');
    }
    setLoading(false);
    if (updateSuccess) {
      getData(jwt, accessToken);
    }
  };

  let logoSocial = logo_google;
  switch (typeSocial) {
    case 'facebook':
      logoSocial = logo_facebook;
      break;
    case 'twitter':
      logoSocial = logo_twitter;
      break;
  }
  let valueSocial = '';
  switch (typeSocial) {
    case 'facebook':
      valueSocial = aesirxData?.social_facebook;
      break;
    case 'twitter':
      valueSocial = aesirxData?.social_twitter;
      break;
    case 'google':
      valueSocial = aesirxData?.social_google;
      break;
  }

  return (
    <div className="py-4 px-4 border rounded">
      <div className="d-flex justify-content-start align-items-center mb-3">
        <Image
          quality={100}
          className="me-2"
          src={logoSocial}
          width={40}
          height={40}
          alt="logo social"
        />
        <p className="fw-semibold fs-18  text-capitalize ms-2 mb-0">{typeSocial}</p>
      </div>
      {valueSocial && (
        <Form.Group>
          <Form.Label className="fw-medium mb-1">ID</Form.Label>
          <div className="position-relative fs-7 mb-1">
            <Form.Control
              type="email"
              name="email"
              value={valueSocial}
              className={`py-13px fs-7`}
              readOnly={true}
            />
            <ButtonCopy
              content={valueSocial}
              className="border-0 top-0 bottom-0 p-0 px-2 m-1 bg-gray-100 position-absolute end-0"
            />
          </div>
        </Form.Group>
      )}
      <Button
        type="button"
        variant={`${valueSocial ? 'danger' : 'success'}`}
        className={`fw-semibold py-12px py-12px w-100 ${valueSocial ? '' : 'mt-3'}`}
        onClick={() => {
          if (valueSocial) {
            disconnectSocial();
          } else {
            connectSocial();
          }
        }}
        disabled={loading}
      >
        {loading && <Spinner size={'sm'} className="me-1" />}
        {valueSocial ? (
          'Disconnect'
        ) : (
          <>
            Connect to <span className="text-capitalize">{typeSocial}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default Social;
