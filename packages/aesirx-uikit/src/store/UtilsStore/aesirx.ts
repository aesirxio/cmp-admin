import FormData from 'form-data';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { env } from 'aesirx-lib';
const getMember = async (accessToken: string) => {
  try {
    const member = await axios.get(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=persona&api=hal&task=getTokenByUser`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );

    if (member?.data?.result?.member_id) {
      const data = await axios.get(
        `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&api=hal&id=${member?.data?.result?.member_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        }
      );
      return data?.data;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('getMember', error);
    throw error;
  }
};

const updateMember = async (bodyData: any, accessToken: any) => {
  try {
    const response = await axios.put(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&api=hal`,
      bodyData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getSubscriptionList = async (username: string, accessToken: string, product: string) => {
  try {
    const response = await axios.get(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=subscription&api=hal&filter[username]=${username}&filter[product]=${product}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('No Content');
    }
    return response?.data?._embedded?.item;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('getSubscriptionList', error);
    throw error;
  }
};

const connectWallet = async (
  address: string,
  walletType: string,
  accessToken: string,
  userName: string
) => {
  try {
    const response = await axios.post(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=setWallet&api=hal`,
      {
        wallet: walletType,
        publicAddress: address,
        username: userName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: 'Bearer ' + accessToken,
        },
      }
    );
    return response?.data;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('connectWalletError', error);
    throw error;
  }
};

const removeWallet = async (
  address: string,
  walletType: string,
  accessToken: string,
  userName: string
) => {
  try {
    const response = await axios.post(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=deleteWallet&api=hal`,
      {
        wallet: walletType,
        publicAddress: address,
        username: userName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );
    return response?.data;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('removeWalletError', error);
    throw error;
  }
};

const getContent = (content: string, customRegex?: any, customRegexReplace?: any) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h2', 'p', 'strong', 'em'],
    ALLOWED_ATTR: ['class', 'style'],
  });
  const regex = customRegex || /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const regexReplace = customRegexReplace || /<\/?[^>]+(>|$)/g;
  const tags = sanitizedContent.match(regex);
  const contents = tags?.map((tag: any) =>
    tag.replace(regexReplace, '').replace(/(<([^>]+)>)/gi, '')
  );
  return contents || [];
};

const getPreregistrationByAddress = async (accountAddress: string, signedNonce: any) => {
  return await axios.get(
    `${env.REACT_APP_WEB3_API_ENDPOINT}/preregistration/account/${accountAddress}/?signature=${signedNonce}&network=${env.NEXT_PUBLIC_CONCORDIUM_NETWORK}`
  );
};

const getServerToken = async () => {
  try {
    const response = await axios.post(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?option=token&api=oauth2`,
      {
        client_id: env.AESIRX_CLIENT_ID,
        client_secret: env.AESIRX_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response?.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('getServerJWT', error);
  }
};

const registerWeb3id = async (data: any) => {
  try {
    return await axios.post(`/api/web3id`, data);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('registerWeb3id', error);
    throw error;
  }
};

const getUserIP = (req: any) => {
  let user_ip = req.headers['x-real-ip'] as any;

  const forwardedFor = req.headers['x-forwarded-for'] as any;
  if (!user_ip && forwardedFor) {
    user_ip = forwardedFor?.split(',').at(0);
  }
  return user_ip;
};
//Format to redform and  return formdata
const formatRedForm = (data: any) => {
  const formData = new FormData();
  const redFormData = data;
  let newKeyMail = '';
  for (const [key] of Object.entries(redFormData)) {
    if (key.includes('email')) {
      newKeyMail = key.replace('_email', '[email]');
      redFormData[newKeyMail] = redFormData[key];
      delete redFormData[key];
    }
  }
  for (const key in redFormData) {
    formData.append(key, redFormData[key]);
  }
  return formData;
};

const registerForm = {
  username: env.NEXT_PUBLIC_USERNAME ?? 0,
  first_name: env.NEXT_PUBLIC_FIRSTNAME ?? 0,
  last_name: env.NEXT_PUBLIC_LASTNAME ?? 0,
  product: env.NEXT_PUBLIC_PRODUCT ?? 0,
  email: env.NEXT_PUBLIC_EMAIL ?? 0,
  organization: env.NEXT_PUBLIC_ORGANIZATION ?? 0,
  message: env.NEXT_PUBLIC_MESSAGE ?? 0,
  order_id: env.NEXT_PUBLIC_ORDER_ID ?? 0,
  code: env.NEXT_PUBLIC_CODE ?? 0,
};

const activeWallet = async (wallet: any, username: any) => {
  try {
    return await axios.post(`/api/activewallet`, { wallet, username });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('activeWallet', error);
    throw error;
  }
};

const forgotPassword = async (data: any) => {
  try {
    const response = await axios.post(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=processResetRequest&api=hal`,
      { data: data },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (data: any) => {
  try {
    const response = await axios.post(
      `${env.REACT_APP_ENDPOINT_URL}/index.php?webserviceClient=site&webserviceVersion=1.0.0&option=member&task=processResetComplete&api=hal`,
      { data: data },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};
const shortenString = (str: any, first: any = 6, last: any = 4) => {
  return str?.substring(0, first) + '...' + str?.substring(str.length - last);
};

export {
  getMember,
  updateMember,
  connectWallet,
  getContent,
  getSubscriptionList,
  getPreregistrationByAddress,
  registerWeb3id,
  getServerToken,
  formatRedForm,
  getUserIP,
  registerForm,
  activeWallet,
  removeWallet,
  forgotPassword,
  resetPassword,
  shortenString,
};
