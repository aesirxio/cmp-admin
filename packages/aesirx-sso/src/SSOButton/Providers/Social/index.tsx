import React, { useContext, useEffect, useState } from 'react';
import { getClientApp, getMember } from '../../../utils';
import axios from 'axios';
import { SSOModalContext } from '../../modal';
import fb_icon from '../../images/logo_facebook.svg';
import google_icon from '../../images/logo_google.svg';
import twitter_icon from '../../images/logo_twitter.svg';
import reddit_icon from '../../images/reddit_icon.png';
import { Button } from 'react-bootstrap';
import CreateAccount from '../CreateAccount';
import arrow_left from '../../images/arrow_left.svg';
import { toast } from 'react-toastify';

const SSOSocialProvider = ({
  typeSocial,
  isAccountExist,
  setIsAccountExist,
  setExpand,
  setAccountInfo,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [idSocial, setIdSocial] = useState('');
  const { noCreateAccount, isSignUpForm, handleOnData, toggle, isRequireEmail } =
    useContext(SSOModalContext);
  const { endpoint } = getClientApp();
  const [showCreate, setShowCreate] = useState('');
  const [showCreatedMessage, setShowCreatedMessage] = useState(false);
  const [isExist, setIsExist] = useState(true);

  const handleSubmit = async (event: any, isCreate = false) => {
    event.preventDefault();
    setShowCreatedMessage(false);
    setLoading(true);
    try {
      const response: any = await axios.get(
        `${endpoint}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=getSocialLoginUrl&api=hal&socialType=${typeSocial}`
      );
      response?.data.result[0] &&
        window.open(response?.data.result[0], 'SSO', 'status=1,height=750,width=650');

      const handleLogin = async (e: any) => {
        if (e.origin !== endpoint) return;
        if (e.data && e.data.socialLogin) {
          if (isCreate) {
            setShowCreatedMessage(true);
          } else {
            const dataLogin = JSON.parse(e.data.socialLogin);
            if (isRequireEmail) {
              setLoading(true);
              const member = await getMember(dataLogin?.access_token);
              if (
                !member?.email ||
                (/@aesirx\.io$/.test(member?.email) &&
                  ((member?.wallet_concordium &&
                    member?.email?.includes(member?.wallet_concordium)) ||
                    (member?.wallet_metamask && member?.email?.includes(member?.wallet_metamask))))
              ) {
                setExpand('require-email');
                setAccountInfo({ data: dataLogin, memberId: member?.member_id });
              } else {
                handleOnData(dataLogin);
              }
              setLoading(false);
            } else {
              handleOnData(dataLogin);
            }
          }
        } else if (e.data.error) {
          !noCreateAccount && setIsExist(false);
          setIsAccountExist({ status: false, type: typeSocial });
          setIdSocial(e.data.id);
          if (isCreate) {
            setExpand(`social-${typeSocial}`);
            setShowCreate(typeSocial);
          }
        }
        window.removeEventListener('message', handleLogin);
      };

      window.addEventListener('message', handleLogin, false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return false;
    }
  };
  useEffect(() => {
    showCreatedMessage && toast.error("You've already created an account with this social media");
  }, [showCreatedMessage]);
  const handleSuccess = async () => {
    setShowCreate('');
    setExpand('social');
    setIdSocial('');
    setIsAccountExist({ status: true, type: '' });
  };
  return (
    <>
      {showCreate === typeSocial ? (
        <>
          <div className="text-start">
            <div
              className="cursor-pointer fw-medium fs-14 d-inline-flex align-items-center back-button text-primary"
              onClick={() => {
                setShowCreate('');
                setExpand('social');
                setIdSocial('');
                setIsAccountExist({ status: true, type: '' });
              }}
            >
              <img src={arrow_left} alt="Back Icon" className="me-1" />
              Back
            </div>
          </div>
          <div className="text-primary">
            <CreateAccount
              setShow={isSignUpForm ? toggle : handleSuccess}
              setIsAccountExist={setIsAccountExist}
              isNoWallet={true}
              noLogin={true}
              socialType={{ id: idSocial, type: typeSocial }}
              isRequireEmail={isRequireEmail}
            />
          </div>
        </>
      ) : (
        <div className="mt-3">
          <Button
            variant="outline"
            type="button"
            onClick={(e) => {
              if (
                !isAccountExist?.status &&
                isAccountExist?.type === typeSocial &&
                (!isExist || isSignUpForm)
              ) {
                if (idSocial) {
                  setExpand(`social-${typeSocial}`);
                  setShowCreate(typeSocial);
                } else {
                  handleSubmit(e, true);
                }
              } else {
                handleSubmit(e);
              }
            }}
            className="w-100 lh-sm fw-semibold d-flex align-items-center"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Waiting...
              </>
            ) : (
              <>
                <img
                  src={
                    typeSocial === 'google'
                      ? google_icon
                      : typeSocial === 'facebook'
                        ? fb_icon
                        : typeSocial === 'twitter'
                          ? twitter_icon
                          : reddit_icon
                  }
                  width={24}
                  height={24}
                  alt="Back Icon"
                  className={`me-2 ${typeSocial === 'twitter' ? 'twitter-icon' : ''}`}
                />
                {!isAccountExist?.status &&
                isAccountExist?.type === typeSocial &&
                (!isExist || isSignUpForm)
                  ? 'Create account'
                  : 'Log in'}{' '}
                with
                <span className="text-capitalize ms-1">
                  {typeSocial?.charAt(0).toUpperCase() + typeSocial?.slice(1)}
                </span>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default SSOSocialProvider;
