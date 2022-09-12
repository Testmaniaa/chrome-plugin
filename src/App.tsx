import * as React from 'react';
import BlockingResponse = chrome.webRequest.BlockingResponse;
import {useEffect, useState} from 'react';
import RequestList from './components/RequestList';
import { requestFilter } from './background';

export type RequestDetails = chrome.webRequest.WebRequestDetails & {
  requestHeaders?: chrome.webRequest.HttpHeader[];
  requestBody?: chrome.webRequest.WebRequestBody;
};

export type RequestEvent = chrome.webRequest.WebRequestHeadersDetails | chrome.webRequest.WebRequestBodyDetails
function App(): React.ReactElement {
  const requestMap = React.useMemo(() => new Map<string, RequestDetails>(), []);
  const [requests, setRequest] = useState<RequestDetails[]>([]);

  useEffect(() => {
    function handler(details: chrome.webRequest.WebRequestHeadersDetails): BlockingResponse|void {
      const { requestId } = details;
      if (!requestMap.has(requestId)) {
        requestMap.set(requestId, details);
      } else {
        const request = requestMap.get(requestId);
        const newDetails = { ...request, ...details };
        requestMap.set(requestId, newDetails);
      }

      // do it different
      setRequest(Array.from(requestMap.values()));
    }
    chrome.webRequest?.onBeforeSendHeaders.addListener(
      handler,
      requestFilter,
      ['blocking', 'requestHeaders', 'extraHeaders']
    );
    chrome.webRequest?.onBeforeRequest.addListener(
      handler,
      requestFilter,
      ['blocking', 'extraHeaders', 'requestBody']
    );

    return () => {
      chrome.webRequest?.onBeforeSendHeaders.removeListener(handler);
      chrome.webRequest?.onBeforeRequest.removeListener(handler);
    };
  }, []);

  return <RequestList requests={requests} />;
};

export default App;
