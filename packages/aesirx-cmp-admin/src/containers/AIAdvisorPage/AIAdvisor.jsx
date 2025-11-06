import React, { useEffect, useState } from 'react';
import { useAIAdvisorViewModel } from './AIAdvisorViewModels/AIAdvisorViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Spinner } from 'react-bootstrap';
import { env } from 'aesirx-lib';
import {
  advisorCreateMessage,
  advisorCreateThread,
  advisorGetMessage,
  advisorMessageStatus,
  advisorRunMessage,
} from 'utils/advisor';
import CopyToClipboard from './CopyToClipboard';
import { PAGE_STATUS, RingLoaderComponent } from 'aesirx-uikit';

const AIAdvisor = observer(() => {
  const {
    consentsList: { initialize, updateAIAdvisor, aiAdvisor, statusAIAdvisor },
  } = useAIAdvisorViewModel();
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
    thread_id: '',
    openai_key: '',
    openai_assistant: '',
  });

  const [domainCategoryStatus, setDomainCategoryStatus] = useState(false);

  const [cookieDeclarationStatus, setCookieDeclarationStatus] = useState(false);

  const [privacyPolicyStatus, setPrivacyPolicyStatus] = useState(false);

  const [consentRequestStatus, setConsentRequestStatus] = useState(false);

  const [dataConsent, setDataConsent] = useState([]);
  const [isHaveScanResult, setIsHaveScanResult] = useState(false);
  const [isAllGenerated, setIsAllGenerated] = useState(false);

  useEffect(() => {
    aiAdvisor?.domain &&
      setValues({
        ...values,
        domain: aiAdvisor?.domain,
        ...(aiAdvisor?.domain_categorization
          ? { domain_categorization: aiAdvisor?.domain_categorization }
          : {}),
        ...(aiAdvisor?.cookie_declaration
          ? { cookie_declaration: aiAdvisor?.cookie_declaration }
          : {}),
        ...(aiAdvisor?.privacy_policy ? { privacy_policy: aiAdvisor?.privacy_policy } : {}),
        ...(aiAdvisor?.consent_request ? { consent_request: aiAdvisor?.consent_request } : {}),
        ...(aiAdvisor?.thread_id ? { thread_id: aiAdvisor?.thread_id } : {}),
        ...(aiAdvisor?.openai_key ? { openai_key: aiAdvisor?.openai_key } : {}),
        ...(aiAdvisor?.openai_assistant ? { openai_assistant: aiAdvisor?.openai_assistant } : {}),
      });
  }, [aiAdvisor]);

  useEffect(() => {
    getDataConsent();
  }, []);

  const getDataConsent = async () => {
    const resBeforeConsent = fetch(`https://aesirx.io/api/services/result?url=${activeDomain[0]}`);

    const resAfterConsent = fetch(
      `https://aesirx.io/api/services/consentresult?url=${activeDomain[0]}`
    );

    const responses = await Promise.all([resBeforeConsent, resAfterConsent]);

    const data = await Promise.all(
      responses.map((res) => {
        return res?.status === 200 ? res?.json() : [];
      })
    );
    setDataConsent(data);
    const afterCookies = getAfterCookies(data);
    if (!afterCookies) {
      setIsHaveScanResult(true);
    }
  };

  const getAfterCookies = (data) => {
    return data[1]?.cookies?.map((item) => {
      return {
        name: item?.name,
        domain: item?.domain,
        expiresDays: item?.expiresDays,
      };
    });
  };
  const getBeforeCookies = (data) => {
    return data[0]?.cookies?.map((item) => {
      return {
        name: item?.name,
        domain: item?.domain,
        expiresDays: item?.expiresDays,
      };
    });
  };

  const handleGenerate = async (type) => {
    const beforeCookies = getBeforeCookies(dataConsent);
    const afterCookies = getAfterCookies(dataConsent);
    const cookieData = {
      site_url: activeDomain[0],
      cookies_pre_consent: beforeCookies,
      beacons_pre_consent: dataConsent[0]?.hosts?.beacons?.thirdParty,
      cookies_post_consent: afterCookies,
      beacons_post_consent: dataConsent[1]?.hosts?.beacons?.thirdParty,
    };
    const domain_categorization_prompt = `
    Base on this domain and beacon from cookies_post_consent, beacons_post_consent list: ${JSON.stringify(
      cookieData,
      null,
      2
    )}.
    Arrange each domain/beacon it into plugins.
    List each domain/beacon into 5 categories Essential, Functional, Analytics, Advertising, Custom.
    And for each plugin please add domain and add should blocked or not.
    Only return domain/beacon not same as ${activeDomain[0]}.
    Please return explaination for each domain. Not return JSON.
    `;
    const cookie_declaration_prompt = `
    You are a privacy compliance assistant specializing in GDPR, ePrivacy, and global data privacy laws. Generate a legally accurate cookie declaration based on the input JSON of scanned cookies and services. Cookies should be categorized, and include name, domain, purpose, duration, and provider. Assume a consent-based model (prior consent unless strictly necessary). This declaration should only include cookies-not beacons or tracking pixels.
    Indicate consent is required for all cookies except strictly necessary ones.
    ${JSON.stringify(cookieData, null, 2)}
    Additions: Explicit instruction: Exclude beacons and pixels. Emphasize consent requirements clearly in the text output. Tables remain the same for cookie display.
    `;
    const privacy_policy_prompt = `
    You are a privacy legal expert assistant tasked with generating privacy policies for websites. Use the provided scan data, services, and jurisdiction to create a GDPR/CCPA/ePrivacy-compliant privacy policy.
    Include the following: Identity of the data controller, Types of personal data collected (incl. data from beacons and tracking pixels), Use of cookies and similar technologies, Legal basis for processing, Third-party services involved, Data retention periods, Sharing of data (who receives it and why), User rights, International transfers, A disclaimer that the policy is a draft and must be reviewed.
    ${JSON.stringify(cookieData, null, 2)}
    Additions: Explicit mention and inclusion of beacons and tracking pixels. Add a draft disclaimer in the generated policy. Ensure third-party data sharing is addressed, with optional placeholder to list vendors. Highlight user rights under GDPR/CCPA. Remove phone number since don't need it.
    `;
    const consent_request_prompt = `
    You are a privacy user experience expert specializing in GDPR, ePrivacy, and CCPA compliance.
    Generate a user-friendly and legally compliant consent message for a website.
    The message must:
      1. Explicitly describe the types of data collected both before and after consent (based on the provided arrays).
      2. Explain clearly *why* the data is collected (purpose and legal basis).
      3. Identify *who* the data may be shared with (third parties or processors, if mentioned or implied).
      4. Acknowledge cookies, beacons, and tracking pixels as distinct but related technologies.
      5. State that the user can control or withdraw consent anytime.
      6. Include links to [Privacy Policy] and [Cookie Declaration].
    If any list (cookies or beacons) is empty, you must still provide a clear, explicit statement explaining that *no non-essential data is collected* until consent is given. Avoid vague or generic phrasing.
    Input JSON: ${JSON.stringify(cookieData, null, 2)}
    Use this information to craft an explicit and transparent consent message.
    `;
    switch (type) {
      case 'domain_categorization':
        setDomainCategoryStatus(true);
        await generateAI(domain_categorization_prompt, type);
        setDomainCategoryStatus(false);
        break;
      case 'cookie_declaration':
        setCookieDeclarationStatus(true);
        await generateAI(cookie_declaration_prompt, type);
        setCookieDeclarationStatus(false);
        break;
      case 'privacy_policy':
        setPrivacyPolicyStatus(true);
        await generateAI(privacy_policy_prompt, type);
        setPrivacyPolicyStatus(false);
        break;
      case 'consent_request':
        setConsentRequestStatus(true);
        await generateAI(consent_request_prompt, type);
        setConsentRequestStatus(false);
        break;
      default:
        break;
    }
  };

  const sendMessage = async (threadID, message) => {
    await advisorCreateMessage(aiAdvisor?.openai_key, threadID, message);
    const run = await advisorRunMessage(
      aiAdvisor?.openai_key,
      aiAdvisor?.openai_assistant,
      threadID
    );
    let runStatus = await advisorMessageStatus(aiAdvisor?.openai_key, threadID, run?.id);
    getMessage(threadID);
    // Initialize a counter and max attempts for the polling logic, and how long to wait each try
    let attempts = 0;
    const maxAttempts = 40;
    const timoutWaitTimeMs = 2000;

    // Loop while the run hasn't completed, or until you have reached the max attempts
    while (runStatus?.status !== 'completed' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, timoutWaitTimeMs));
      runStatus = await advisorMessageStatus(aiAdvisor?.openai_key, threadID, run?.id);
      attempts++;
    }
    return getMessage(threadID);
  };
  const getMessage = async (threadID) => {
    const messagesDisplay = await advisorGetMessage(aiAdvisor?.openai_key, threadID);
    return messagesDisplay;
  };

  async function generateAI(prompt, id) {
    let threadID = aiAdvisor?.thread_id;
    if (!threadID) {
      const thread = await advisorCreateThread(aiAdvisor?.openai_key, prompt);
      threadID = thread?.id;
      setValues({ ...values, thread_id: threadID });
      await updateAIAdvisor({ ...values, thread_id: threadID });
    }
    const message = await sendMessage(threadID, prompt);
    setValues({ ...values, [id]: message[0]?.content[0]?.text?.value });
    await updateAIAdvisor({ ...values, [id]: message[0]?.content[0]?.text?.value });
  }

  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">AI Privacy Advisor</h2>
        </div>
      </div>
      {statusAIAdvisor === PAGE_STATUS.LOADING ? (
        <>
          <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
        </>
      ) : (
        <>
          {aiAdvisor?.is_cmp_license_valid && aiAdvisor?.license_key ? (
            <>
              <div className="bg-white w-100 rounded-3 p-4">
                <strong>AI Privacy Advisor</strong> helps you manage cookie and beacon compliance by
                analyzing what loads before and after consent. It provides detailed insights and
                generates privacy documentation based on real scan data. You can easily create
                cookie declarations, privacy policies, and consent text to support GDPR and ePrivacy
                Directive compliance. While optimized for strict opt-in regimes like the EU, it also
                supports transparency and documentation requirements for opt-out frameworks such as
                CCPA.
              </div>
              {!aiAdvisor?.domain_categorization &&
              !aiAdvisor?.cookie_declaration &&
              !aiAdvisor?.privacy_policy &&
              !aiAdvisor?.consent_request ? (
                <div className="mt-4">
                  <Button
                    className="ai_generate_button d-flex align-items-center w-auto"
                    variant="success"
                    disabled={isAllGenerated}
                    onClick={async () => {
                      setIsAllGenerated(true);
                      await handleGenerate('domain_categorization');
                      await handleGenerate('cookie_declaration');
                      await handleGenerate('privacy_policy');
                      await handleGenerate('consent_request');
                      setIsAllGenerated(false);
                    }}
                  >
                    {isAllGenerated && <Spinner size="sm" className="me-2" />}
                    <div>Generate</div>
                  </Button>
                </div>
              ) : (
                <></>
              )}

              <div
                id="domain_categorization"
                className="prompt_item bg-white rounded-3 p-32px mt-4"
              >
                <div className="prompt_item_title">Domain Categorization</div>
                <div className="prompt_item_question">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/question.png'}
                  />
                  This draft was automatically generated based on real scan data from your website
                  and identifies third-party domains, cookies, and beacons used, categorized by
                  purpose.
                </div>
                <div className="prompt_item_warning">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/warning.png'}
                  />
                  Please review and adjust the content to make sure it reflects your actual data
                  practices before publishing.
                </div>
                <div className="prompt_item_info" style={{ alignItems: 'start' }}>
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/info.png'}
                  />
                  <div>
                    <div>
                      <strong>Disclaimer:</strong>The AI Privacy Advisor can only detect third-party
                      services (such as cookies, scripts, or domains) that are integrated through
                      recognized patterns or common injection methods. Any third-party technologies
                      manually inserted into a site’s source code (e.g., within the{' '}
                      <strong>&lt;head&gt;</strong> or <strong>&lt;footer&gt;</strong> sections)
                      bypass plugin detection and must be manually move the loading of such scripts
                      or links into the <strong>window.aesirxHoldBackJS</strong> function within
                      your code.
                    </div>
                    <code
                      style={{
                        display: 'inline-block',
                        whiteSpace: 'pre',
                        marginTop: '10px',
                        borderRadius: '10px',
                        padding: '0 20px',
                        width: 'auto',
                        background: '#f0f0f1',
                      }}
                    >
                      {`window.aesirxHoldBackJS = async function ()
[
    {
        category: "analytics", // essential | functional | analytics | advertising | custom
        name: "Analytics Script",
        script: () => {
          // Load your 3rd party or JS you need after consent here
        }
    }
]}`}
                    </code>
                  </div>
                </div>
                <div className="prompt_item_result">
                  <div className="loading">
                    <div className="loader"></div>
                  </div>
                  <CopyToClipboard htmlContent={values?.domain_categorization} />
                </div>
                <div className="domain_categorization_result"></div>
                <div className="domain_categorization_buttons">
                  <Button
                    variant="success"
                    disabled={isHaveScanResult || domainCategoryStatus}
                    className="prompt_item_regenerate d-flex align-items-center"
                    onClick={() => {
                      handleGenerate('domain_categorization');
                    }}
                  >
                    {domainCategoryStatus && <Spinner size="sm" className="me-2" />}
                    <div>Regenerate</div>
                  </Button>
                </div>
                {isHaveScanResult ? (
                  <div className="error" style={{ color: 'red' }}>
                    Your site not having scanned result yet. Please contact Aesirx team to perform
                    scan.
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div id="cookie_declaration" className="prompt_item bg-white rounded-3 p-32px">
                <div className="prompt_item_title">Cookie Declaration</div>
                <div className="prompt_item_question">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/question.png'}
                  />
                  This draft was automatically generated based on real scan data from your website
                  and lists the cookies and tracking technologies detected.
                </div>
                <div className="prompt_item_warning">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/warning.png'}
                  />
                  Please review and adjust the content to make sure it reflects your actual data
                  practices before publishing.
                </div>
                <div className="prompt_item_info">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/info.png'}
                  />
                  For full setup instructions:{' '}
                  <a
                    href="https://aesirx.io/documentation/cmp/how-to/aesirx-cmp-how-to-generate-a-cookie-declaration-with-ai"
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-underline"
                  >
                    AesirX CMP Guide: How to Generate a Cookie Declaration with AI
                  </a>
                  .
                </div>
                <div className="prompt_item_result">
                  <div className="loading">
                    <div className="loader"></div>
                  </div>
                  <CopyToClipboard htmlContent={values?.cookie_declaration} />
                </div>
                <Button
                  variant="success"
                  className="prompt_item_regenerate d-flex align-items-center"
                  disabled={cookieDeclarationStatus}
                  onClick={() => {
                    handleGenerate('cookie_declaration');
                  }}
                >
                  {cookieDeclarationStatus && <Spinner size="sm" className="me-2" />}
                  <div>Regenerate</div>
                </Button>
              </div>
              <div id="privacy_policy" className="prompt_item bg-white rounded-16px p-32px">
                <div className="prompt_item_title">Privacy Policy</div>
                <div className="prompt_item_question">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/question.png'}
                  />
                  This draft was automatically generated based on real scan data from your website
                  and outlines the data collection and processing activities detected.
                </div>
                <div className="prompt_item_warning">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/warning.png'}
                  />
                  Please review and adjust the content to make sure it reflects your actual data
                  practices before publishing.
                </div>
                <div className="prompt_item_info">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/info.png'}
                  />
                  For full setup instructions:{' '}
                  <a
                    href="https://aesirx.io/documentation/cmp/how-to/aesirx-cmp-guide-how-to-generate-a-privacy-policy-with-ai"
                    target="_blank"
                    rel="noreferrer"
                  >
                    AesirX CMP Guide: How to Generate a Privacy Policy with AI
                  </a>
                  .
                </div>
                <div className="prompt_item_result">
                  <div className="loading">
                    <div className="loader"></div>
                  </div>
                  <CopyToClipboard htmlContent={values?.privacy_policy} />
                </div>
                <Button
                  variant="success"
                  className="prompt_item_regenerate d-flex align-items-center"
                  disabled={privacyPolicyStatus}
                  onClick={() => {
                    handleGenerate('privacy_policy');
                  }}
                >
                  {privacyPolicyStatus && <Spinner size="sm" className="me-2" />}
                  <div>Regenerate</div>
                </Button>
              </div>
              <div id="consent_request" className="prompt_item bg-white rounded-16px p-32px">
                <div className="prompt_item_title">Consent Request</div>
                <div className="prompt_item_question">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/question.png'}
                  />
                  This draft was automatically generated based on real scan data from your website
                  and provides a consent message tailored to the technologies and data flows
                  detected.
                </div>
                <div className="prompt_item_warning">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/warning.png'}
                  />
                  Please review and adjust the content to make sure it reflects your actual data
                  practices before publishing.
                </div>
                <div className="prompt_item_info d-none">
                  <img
                    width="24px"
                    height="24px"
                    src={env.PUBLIC_URL + '/assets/images/info.png'}
                  />
                  For full setup instructions: AesirX CMP Guide: How to Generate Consent Request
                  Text with AI
                </div>
                <div className="prompt_item_result">
                  <div className="loading">
                    <div className="loader"></div>
                  </div>
                  <CopyToClipboard htmlContent={values?.consent_request} />
                </div>
                <Button
                  variant="success"
                  className="prompt_item_regenerate d-flex align-items-center"
                  disabled={consentRequestStatus}
                  onClick={() => {
                    handleGenerate('consent_request');
                  }}
                >
                  {consentRequestStatus && <Spinner size="sm" className="me-2" />}
                  <div>Regenerate</div>
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white w-100 rounded-3 p-4">
              Your license is expried or not found. Please update new license{' '}
              <a href="https://aesirx.io/licenses" target="_blank" rel="noreferrer">
                https://aesirx.io/licenses
              </a>
              .
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default AIAdvisor;
