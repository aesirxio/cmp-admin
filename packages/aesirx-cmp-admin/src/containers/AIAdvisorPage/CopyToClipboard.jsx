import { env } from 'aesirx-lib';
import { marked } from 'marked';
import React, { useState, useRef } from 'react';

const CopyToClipboard = ({ htmlContent }) => {
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const handleCopy = async () => {
    const html = resultRef.current.innerHTML;
    const text = resultRef.current.innerText;

    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' }),
          }),
        ]);
        showCopied();
        return;
      } catch (err) {
        console.error('Clipboard API error:', err);
      }
    }

    // --- Fallback ---
    const tempEl = document.createElement('div');
    tempEl.contentEditable = true;
    tempEl.innerHTML = html;
    document.body.appendChild(tempEl);

    const range = document.createRange();
    range.selectNodeContents(tempEl);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
      console.log('Fallback copied');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    selection.removeAllRanges();
    document.body.removeChild(tempEl);
    showCopied();
  };

  const showCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      <div className="copy_clipboard" onClick={handleCopy}>
        <img width="20px" height="20px" src={env.PUBLIC_URL + '/assets/images/copy.svg'} />
        <span className={`copied_text ${copied ? 'show' : ''}`}>Copied!</span>
      </div>
      <div
        ref={resultRef}
        className="result"
        dangerouslySetInnerHTML={{ __html: htmlContent ? marked.parse(htmlContent) : '' }}
      />
    </>
  );
};

export default CopyToClipboard;
