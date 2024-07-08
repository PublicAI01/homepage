import Mail from '@/assets/svg/mail.svg?react';

const Footer = () => {
  return (
    <footer className="pt-5 md:pt-10">
      <div className="container relative mx-auto flex flex-col items-end">
        <section className="flex flex-col">
          <h6 className="text-lg font-semibold text-white md:text-2xl">
            Contact us
          </h6>
          <a
            href="mailto:contact@publicai.io"
            className="my-3 flex items-center py-2 text-white max-md:pr-4 md:my-6 md:py-4">
            <Mail className="size-4 md:size-8" />
            <p className="ml-2 text-base md:text-lg">contact@publicai.io</p>
          </a>
        </section>
      </div>
      <div className="bg-b4 text-center">
        <span className="mt-5 text-g1">
          © {new Date().getFullYear()} PublicAI All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
