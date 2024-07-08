import Mail from '@/assets/svg/mail.svg?react';

const Footer = () => {
  return (
    <footer className="pt-10">
      <div className="container mx-auto relative flex flex-col items-end">
        <section className="flex flex-col">
          <h6 className="text-2xl font-semibold text-white">Contact us</h6>
          <div className="flex items-center my-10 text-white">
            <Mail className="size-8" />
            <a
              className="ml-2 text-lg"
              href="mailto:contact@publicai.io">
              contact@publicai.io
            </a>
          </div>
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
