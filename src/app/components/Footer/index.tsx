import Mail from '@/assets/svg/mail.svg?react';

const Footer = () => {
  return (
    <footer className="pt-5 md:pt-10">
      <div className="container mx-auto relative flex flex-col items-end">
        <section className="flex flex-col">
          <h6 className="text-lg font-semibold text-white md:text-2xl">
            Contact us
          </h6>
          <a
            href="mailto:contact@publicai.io"
            className="flex items-center py-2 my-3 text-white max-md:pr-4 md:py-4 md:my-6">
            <Mail className="size-4 md:size-8" />
            <p className="ml-2 text-base md:text-lg">contact@publicai.io</p>
          </a>
        </section>
      </div>
      <div className="bg-b4 text-center">
        <span className="text-g1 mt-5">
          © {new Date().getFullYear()} PublicAI All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
