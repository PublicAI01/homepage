'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { DISCORD_LINK, TELEGRAM_LINK, TWITTER_LINK } from '@/constant';

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
              <article className="prose prose-sm rounded-xl border border-white/10 bg-b2 px-6 py-4 prose-a:text-white prose-li:marker:text-red-500 max-md:mx-4">
                <h1 className="text-center text-sm font-bold text-red-500 md:text-lg">
                  Urgent Announcement
                </h1>
                <div className="text-xs font-medium text-white md:text-base">
                  <b>
                    Our X account @PublicAI_ has been compromised. DO NOT trust
                    any messages posted by the @PublicAI_ account during this
                    time.
                  </b>
                  <p>Specifically:</p>
                  <ul>
                    <li>DO NOT click on any links shared by the account.</li>
                    <li>
                      DO NOT purchase any tokens or CA promoted by the account.
                    </li>
                  </ul>
                  <p>
                    Our product and platform remain fully functional and secure.
                    For updated communication while we recover our X please
                    follow our backup X account, telegram, and discord:
                  </p>
                  <ul>
                    <li>
                      <a
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noopener noreferrer">
                        @PublicAIData
                      </a>{' '}
                      X backup account
                    </li>
                    <li>
                      <a
                        href={TELEGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer">
                        t.me/PublicAINews
                      </a>{' '}
                      announcements
                    </li>
                    <li>
                      <a
                        href={DISCORD_LINK}
                        target="_blank"
                        rel="noopener noreferrer">
                        discord.gg/PublicAI
                      </a>{' '}
                      announcements
                    </li>
                  </ul>
                  <p>Thank you for your continued support!</p>
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
