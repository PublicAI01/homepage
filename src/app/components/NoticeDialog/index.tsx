'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const NoticeDialog = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (mounted && visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mounted, visible]);

  return (
    <>
      {mounted &&
        visible &&
        createPortal(
          <>
            <dialog
              className="fixed inset-x-0 top-0 z-[100] flex h-screen w-full cursor-pointer items-center justify-center bg-black/10 backdrop-blur-sm"
              open
              onClick={() => {
                setVisible(false);
              }}>
              <article className="prose prose-sm rounded-xl border border-white/10 bg-b2 px-6 py-4 prose-a:text-primary prose-li:marker:text-red-500 max-md:mx-4">
                <h1 className="text-center text-sm font-bold text-red-500 md:text-lg">
                  Urgent Security Alert: Compromised X Account 🚨
                </h1>
                <div className="text-xs font-medium text-white md:text-base">
                  <b>
                    Important Notice: Our official X account @PublicAI_ has been
                    compromised. We are working diligently to regain control. ⚠️
                    Please DO NOT trust any messages posted by the @PublicAI_
                    account during this time.
                  </b>
                  <p>Specifically:</p>
                  <ul>
                    <li>DO NOT click on any links shared by the account. 🔗</li>
                    <li>
                      DO NOT purchase any tokens or cryptocurrencies promoted by
                      the account. 💰 These are likely fraudulent.
                    </li>
                    <li>
                      DO NOT share personal information with the account. 🔒
                    </li>
                  </ul>
                  <p>
                    Rest assured, our product and platform remain fully
                    functional and secure. This issue only affects our X
                    account.
                  </p>
                  <p>
                    We appreciate your understanding and are taking all
                    necessary steps to restore the account to its normal, secure
                    state. We will notify you as soon as the account is
                    recovered. In the meantime, please refer to our official{' '}
                    <a
                      href="https://t.me/PublicAINews"
                      target="_blank"
                      rel="noopener noreferrer">
                      Telegram Channel
                    </a>{' '}
                    for accurate information and updates.
                  </p>
                </div>
              </article>
            </dialog>
          </>,
          document.body,
        )}
    </>
  );
};

export default NoticeDialog;
