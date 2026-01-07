import { type Metadata } from 'next';
import Link from 'next/link';

import { SUPPORT_EMAIL_ADDRESS } from '@/constant';

export const metadata: Metadata = {
  title: 'PublicAI Data Privacy Policy',
  description:
    'Web3 based Train-To-Earn network enables every human to upgrade AI and earn rewards by completing data tasks.',
  keywords:
    'Public AI, data annotation, label to earn, decentralized, AI companies, training data, data labeling',
};

export default function Page() {
  return (
    <section className="prose prose-invert max-md:prose-sm max-md:px-mobile-padding-x max-md:w-screen md:mx-auto md:max-w-[85ch]!">
      <h1>PublicAI Data PRIVACY POLICY</h1>
      <p>
        Last Updated:{' '}
        {Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(new Date(Date.UTC(2026, 0, 7)))}
      </p>

      <p>
        At PublicAI (referred to here as “we”, “us” or “our”), we are dedicated
        to empowering you (“you” and “your” or “Users”, as relevant) to reclaim
        control over your data rights and to receive fair rewards for the data
        you choose to share. We believe in transparency, privacy, and ensuring
        that you benefit directly from the value of your data. This Privacy
        Policy governs your use of the Data Hunter, Data Hub, Public AI Arena,
        the Website located at <Link href="/">https://publicai.io/</Link> (the
        “Site”) and other products or services provided by us via the Site
        (collectively, the “Services”).
      </p>

      <p>
        This Privacy Policy describes how we collect, use, and disclose your
        information when you use our Services, which include the services
        offered on our Site. Please note that we do not control websites,
        applications, or services operated by third parties, and we are not
        responsible for their actions. We encourage you to review the privacy
        policies of the other websites, decentralized applications, and services
        you use to access or interact with our Services.
      </p>

      <h2>OUR COLLECTION OF YOUR INFORMATION</h2>
      <p>
        Sometimes we collect your information automatically when you interact
        with our services, and sometimes we collect your information directly
        from individuals. At times, we may collect information about an
        individual from other sources and third parties, even before our first
        direct interaction.
      </p>

      <h2>USE OF USER-UPLOADED DATA FOR AI MODEL TRAINING</h2>

      <p>
        To provide, maintain, and continuously improve our services and
        artificial intelligence technologies, <strong>PublicAI</strong> may use
        content uploaded, submitted, generated, or otherwise provided by users
        in connection with the training and development of artificial
        intelligence models.
      </p>

      <h3>1. Definition and Scope of User-Uploaded Data</h3>
      <p>
        “User-Uploaded Data” refers to any data or content provided by users in
        the course of using the Services, including but not limited to text,
        images, audio, video, files, annotations, interaction records, and any
        derived data, such as processed, transformed, anonymized, or aggregated
        data.
      </p>

      <h3>2. Purposes of Use</h3>
      <p>User-Uploaded Data may be used for the following purposes:</p>
      <ul>
        <li>
          Training, testing, validating, evaluating, optimizing, and improving
          artificial intelligence models, algorithms, and related technologies;
        </li>
        <li>
          Enhancing model performance in understanding, generation, prediction,
          and analysis;
        </li>
        <li>
          Developing, improving, or expanding existing or future products,
          features, and services;
        </li>
        <li>
          Conducting research, technical validation, and quality assurance
          related to artificial intelligence.
        </li>
      </ul>

      <h3>3. License and Grant of Rights</h3>
      <p>
        To the extent permitted by applicable law, by using the Services and
        uploading any data, users hereby knowingly and voluntarily grant{' '}
        <strong>PublicAI</strong>, its affiliates, partners, and service
        providers a worldwide, non-exclusive, irrevocable, royalty-free license
        to copy, store, use, process, analyze, transform, aggregate, derive
        from, and otherwise utilize User-Uploaded Data for the purposes
        described above, including artificial intelligence model training and
        technological development.
      </p>

      <h3>4. Duration of Authorization</h3>
      <p>
        Unless otherwise required by applicable law or unless the user lawfully
        exercises and completes a data deletion request, the authorization
        described above is granted on a perpetual basis, effective from the date
        the User-Uploaded Data is first provided.
      </p>

      <h3>5. Privacy Protection and De-Identification</h3>
      <p>
        Before or during the use of User-Uploaded Data for AI model training, we
        may apply de-identification, anonymization, or aggregation techniques to
        reduce the risk of identifying individuals. We will protect personal
        information in accordance with this Privacy Policy and applicable data
        protection laws, and will implement reasonable technical and
        organizational safeguards.
      </p>

      <h3>6. User Rights</h3>
      <p>
        Nothing in this section limits users’ rights to access, correct, delete,
        or otherwise control their personal data as provided under applicable
        law and other sections of this Privacy Policy. For details on how to
        exercise these rights, please refer to the “User Rights” section or
        equivalent provisions of this Privacy Policy.
      </p>

      <h3>WHAT INFORMATION WE COLLECT</h3>
      <p>
        We may collect the following information individuals provide in
        connection with our services:
      </p>
      <ol>
        <li>
          <strong>Information you provide</strong>
          <ul>
            <li>
              Blockchain related information, such as wallet information,
              account balances, and on-chain transaction information
            </li>
            <li>
              Your basic information, including name, email, social media
              handles, business name and other information you provide to us
              (“Basic User Information”)
            </li>
            <li>
              Data that you voluntarily submit to us for the purpose of AI
              training, including but not limited to photos, texts, audio,
              video, and social media information, etc, the information you
              provided during our AI training process, and other media files
              (&quot;Training Data&quot;)
            </li>
          </ul>
        </li>
        <li>
          <strong>Information collected automatically</strong>
          <ul>
            <li>Browser and Device Information</li>
            <li>IP address/derived location information</li>
            <li>
              Other device characteristics or identifiers (e.g. plugins, the
              network you connect to)
            </li>
          </ul>
        </li>
        <li>
          <strong>Information we obtain from third parties</strong>
          <ul>
            <li>
              Information from Analytics Providers: We receive information about
              your website usage and interactions from third party analytics
              providers. This includes browser fingerprint, device information,
              and IP address.
            </li>
            <li>
              Error Tracking Data: We utilize information from third party
              service providers to provide automated error monitoring,
              reporting, alerting and diagnostic capture for Service and Site
              errors to allow Users to build more effectively.
            </li>
          </ul>
        </li>
      </ol>

      <h2>OUR USE OF YOUR INFORMATION</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Manage our organization and its day-to-day operations;</li>
        <li>
          Communicate with individuals, including via email and social media;
        </li>
        <li>
          Market our services to individuals, including through in-person
          events, social media, email, and other online venues, based on
          individual interests and interactions with us;
        </li>
        <li>
          Administer, provide, maintain, improve, and personalize our products
          and services, including by recognizing an individual and remembering
          their information when they return to our services;
        </li>
        <li>
          Facilitate transactions and individual benefits and services,
          including customer support, contests, sweepstakes, and promotions;
        </li>
        <li>Identify and analyze how individuals use our services;</li>
        <li>
          Monitor and analyze trends, usage, and activities in connection with
          our services;
        </li>
        <li>
          Improve and customize our services to address the needs and interests
          of our user base and other individuals we interact with;
        </li>
        <li>Improve or support the Service;</li>
        <li>
          Test, enhance, update, and monitor the services, or diagnose or fix
          technology problems;
        </li>
        <li>
          Help maintain the safety, security, and integrity of our property and
          services, technology assets, and business;
        </li>
        <li>
          Defend, protect, or enforce our rights or applicable contracts and
          agreements;
        </li>
        <li>
          Detect, prevent, investigate, or provide notice of malicious,
          deceptive, fraudulent, unlawful or criminal activity;
        </li>
        <li>
          Facilitate business transactions and reorganizations impacting the
          structure of our business;
        </li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2>OUR DISCLOSURE OF YOUR INFORMATION</h2>
      <p>We disclose the information we collect to:</p>
      <ul>
        <li>
          <strong>AI Data or AI Training Requesters:</strong> We may share your
          Training Data with qualified individuals, organizations, or entities,
          known to you, that require user-provided data to develop, train, or
          enhance AI models and systems. These requesters may include vetted
          companies, research institutions, or trusted partners who utilize
          collected data to improve the performance, accuracy, and functionality
          of their AI technologies.
        </li>
        <li>
          <strong>Identity Verification Providers:</strong> Where we engage a
          third-party identity verification provider to help us verify the
          identity of a specific individual with whom we are interacting, we
          will typically provide the third-party identity verification provider
          sufficient information to facilitate the identity verification
          service.
        </li>
        <li>
          <strong>Event, Promotion and Other Business Partners:</strong> Just as
          we may receive information from our event, promotion and other
          business partners, we may share information with them in connection
          with the relevant event, promotion or service we are offering.
        </li>
        <li>
          <strong>Data Analytics Providers:</strong> We may share information
          with our data analytics providers to facilitate the analytics services
          they are providing us.
        </li>
        <li>
          <strong>Other Service Providers:</strong> In addition to the third
          parties identified above, we engage other third-party service
          providers that perform business or operational services for us or on
          our behalf, such as web hosting, shipping and delivery, payment
          processing, fraud prevention, customer service, contests, sweepstakes,
          promotions, and marketing and advertising services. Depending on the
          function the provider serves, the service provider may process
          information on our behalf or have access to information while
          performing functions on our behalf.
        </li>
        <li>
          <strong>Business Transaction or Reorganization:</strong> We may take
          part in or be involved with a business transaction, such as a merger,
          acquisition, joint venture, or financing or sale or other transfer of
          company assets. We may disclose your information to a third party
          during negotiation of, in connection with or as an asset in such a
          business transaction. Your information may also be disclosed in the
          event of insolvency, bankruptcy, or receivership.
        </li>
        <li>
          <strong>Legal Obligations and Rights:</strong> We may disclose
          information to third parties, such as legal advisors and law
          enforcement:
          <ol>
            <li>
              in connection with the establishment, exercise, or defense of
              legal claims;
            </li>
            <li>
              to comply with laws or to respond to lawful requests and legal
              process;
            </li>
            <li>
              to protect our rights and property and the rights and property of
              others, including to enforce our agreements and policies;
            </li>
            <li>to detect, suppress, or prevent fraud;</li>
            <li>to protect the health and safety of us and others; or</li>
            <li>as otherwise required by applicable law.</li>
          </ol>
        </li>
        <li>
          <strong>Otherwise with Consent or Direction:</strong> We may disclose
          the information about an individual to certain other third parties or
          publicly with the individual’s consent or direction. For example, with
          an individual’s consent or direction we may post their testimonial on
          our services.
        </li>
      </ul>

      <h2>COOKIES AND RELATED TECHNOLOGIES</h2>
      <p>We and our third-party providers may use</p>
      <ol type="i">
        <li>
          cookies or small data files that are stored on an individual’s
          computer;
        </li>
        <li>
          and other, similar technologies, such as web beacons, pixels, embedded
          scripts, location-identifying technologies and logging technologies
          (collectively, “cookies”) to automatically collect your information
          and use or disclose your information for the purposes described in the
          sections above.
        </li>
      </ol>
      <p>
        For example, our services use Google Analytics, a web analytics service
        provided by Google, Inc. (“Google”), to collect and view reports about
        the traffic on our website. Individuals can obtain more information on
        the use of Google Analytics by visiting Google’s privacy policy{' '}
        <Link href="https://policies.google.com/privacy">here</Link> and
        individuals can view Google’s currently available opt-out options{' '}
        <Link href="https://tools.google.com/dlpage/gaoptout">here</Link>.
      </p>

      <h2>CHOICE RELATING TO THE USE OF COOKIES ON OUR PLATFORM SERVICES</h2>
      <p>
        If an individual would prefer not accepting cookies, most browsers will
        allow the individual to:
      </p>
      <ol type="i">
        <li>
          change the individual’s browser settings to notify the individual when
          the individual receives a cookie, which lets the individual choose
          whether or not to accept it;
        </li>
        <li>disable existing cookies;</li>
        <li>set the individual’s browser to automatically reject cookies.</li>
      </ol>
      <p>
        Please note that doing so may negatively impact the individual’s
        experience using our website, as some features and offerings may not
        work properly or at all. Depending on the individual’s device and
        operating system, the individual may not be able to delete or block all
        cookies. In addition, if the individual wants to reject cookies across
        all browsers and devices, the individual will need to do so on each
        browser on each device the individual actively uses. The individual may
        also set their email options to prevent the automatic downloading of
        images that may contain technologies that would allow us to know whether
        they have accessed our email and performed certain functions with it.
      </p>

      <h2>CHILDREN’S PERSONAL INFORMATION</h2>
      <p>
        Our services are not directed to, and we do not intend to, or knowingly,
        collect or solicit personal information from children under the age of
        13. If an individual is under the age of 13, they should not use our
        services or otherwise provide us with any personal information either
        directly or by other means. If a child under the age of 13 has provided
        personal information to us, we encourage the child’s parent or guardian
        to contact us to request that we remove the personal information from
        our systems. If we learn that any personal information we collect has
        been provided by a child under the age of 13, we will promptly delete
        that personal information.
      </p>

      <h2>LINKS TO THIRD-PARTY WEBSITE OR SERVICES</h2>
      <p>
        Our services may include links to third-party websites, plug-ins, and
        applications. Except where we post, link to, or expressly adopt or refer
        to this Privacy Notice, this Privacy Notice does not apply to, and we
        are not responsible for, any personal information practices of
        third-party websites and online services or the practices of other third
        parties. To learn about the personal information practices of third
        parties, please visit their respective privacy notices.
      </p>

      <h2>INFORMATION FOR CALIFORNIA RESIDENTS</h2>
      <p>
        In addition to the information and rights described in this Privacy
        Policy, residents of California have additional rights and access to
        specific information under the California Consumer Privacy Act (“CCPA”)
        concerning their personal information. This section of the Privacy
        Policy applies to you if you are a California resident (referred to as a
        “Consumer” as defined by the CCPA). If you are not a Consumer, this
        section does not apply to you, and you should not rely on it.
      </p>

      <h3>1. Information Collection and Usage</h3>
      <p>
        The following is a summary of the personal information (as defined by
        the CCPA) we collect and use in connection with our Services for
        commercial and business purposes. For more details, please refer to the
        relevant sections of this Privacy Policy.
      </p>

      <p>
        Categories of Personal Information we may collect and use for commercial
        and business purposes:
      </p>
      <ul>
        <li>
          Contact and account registration information: When you register for an
          account or get in touch with us, you may provide us with your name,
          email address, physical address, phone number, account username and
          password, electronic signature, and other relevant details.
        </li>
        <li>
          Financial or payment information: We collect information related to
          the payment methods you provide, billing details, and information
          about the products or services you purchase.
        </li>
        <li>
          Transaction information: When you use our Services for transactions,
          we may collect the names and email addresses of transaction
          participants, subject lines, the history of actions taken within a
          transaction (e.g., reviews, signatures, enabling features), and
          personal information of individuals involved or their devices, such as
          names, email addresses, IP addresses, and authentication methods.
        </li>
        <li>
          Customer service information: We gather information regarding your
          customer service interactions with us, including any questions or
          messages you send us directly through online forms, email, phone, or
          mail.
        </li>
        <li>
          Information about your web browser, mobile device, or internet
          connection: When you access our Services online, we may automatically
          collect your IP address, device identifiers, device attributes
          (including cookie IDs and mobile advertising IDs), data on how you
          interact with our online Services (usage data), location information
          (such as city, state, country, and ZIP code associated with your IP
          address or derived through Wi-Fi triangulation), and, with your
          permission based on your mobile device settings, precise geolocation
          information obtained from GPS functionality on your mobile device.
        </li>
      </ul>

      <h3>
        Commercial and Business Purposes for Using Collected Personal
        Information:
      </h3>
      <ul>
        <li>
          Providing requested products and services to you and processing
          payments.
        </li>
        <li>
          Creating and managing your account, and maintaining our relationship
          with you (e.g., communication, providing requested information).
        </li>
        <li>
          Sending you transaction records, including those related to purchases
          or other events.
        </li>
        <li>
          Marketing features, products, or special events via email or phone,
          and sending you marketing communications about third-party products
          and services we believe may interest you.
        </li>
        <li>Conducting sweepstakes, contests, and refer-a-friend programs.</li>
        <li>
          Selecting and delivering tailored content and advertising, and
          supporting marketing and advertising efforts for our Services.
        </li>
        <li>
          Generating and analyzing data about our users and their usage of our
          Services.
        </li>
        <li>
          Testing changes and developing new features and products for our
          Services.
        </li>
        <li>
          Addressing issues you may encounter with our Services, including
          providing support and resolving disputes.
        </li>
        <li>
          Managing the Services platform, including support systems and
          security.
        </li>
        <li>
          Preventing, investigating, and responding to fraud, unauthorized
          access or use of our Services, violations of terms and policies, or
          other inappropriate activities.
        </li>
        <li>
          Complying with legal obligations and applicable retention periods.
        </li>
        <li>
          Establishing, exercising, or defending our rights in legal claims.
        </li>
      </ul>

      <h3>2. The Right to Opt Out of Personal Information Sales</h3>
      <p>
        Consumers have the right to opt out of the “sales” of their personal
        information as defined by the CCPA. According to the CCPA, with certain
        exceptions, a “sale” occurs when a business sells, rents, releases,
        discloses, disseminates, makes available, transfers, or otherwise
        communicates orally, in writing, or electronically, a consumer&apos;s
        personal information to another business or a third party in exchange
        for monetary or other valuable consideration.
      </p>

      <p>
        As explained in more detail in other part of this Privacy Policy, we
        share personal information with other companies. Consumers can submit
        requests to opt out of such sharing using the following methods:
      </p>
      <ul>
        <li>
          Adjusting cookie settings and selecting the option to opt out of
          respective cookie activities.
        </li>
        <li>
          Clicking the “unsubscribe” link at the bottom of any Project marketing
          communication.
        </li>
      </ul>

      <h3>3. The Right to Access</h3>
      <p>
        Consumers have the right to request specific details about the personal
        information we have collected about them within the past 12 months. This
        includes the right to request:
      </p>
      <ul>
        <li>
          The specific pieces of personal information and categories of personal
          information we collected about them.
        </li>
        <li>
          The categories of personal information we sold or disclosed for
          business purposes and the categories of third parties to whom we sold
          or disclosed that information for a business purpose.
        </li>
        <li>
          The categories of sources from which we collected personal
          information.
        </li>
      </ul>

      <h3>4. The Right to Deletion</h3>
      <p>
        Consumers have the right to request the deletion of personal information
        we have collected from them. However, the CCPA allows us to retain
        information in certain circumstances (e.g., legal obligations, specific
        exceptions outlined by the CCPA).
      </p>

      <h3>5. How to Exercise Access and Deletion Rights</h3>
      <p>
        Consumers can submit requests for accessing or deleting their personal
        information by accessing and reviewing personal information associated
        with your account by contacting us via{' '}
        <Link href={`mailto:${SUPPORT_EMAIL_ADDRESS}`}>
          {SUPPORT_EMAIL_ADDRESS}
        </Link>
        .
      </p>

      <p>
        For security purposes, we will verify your identity before fulfilling
        your request. If you have an account with us, we may verify your
        identity by having you log in. If you don&apos;t have an account, we may
        need to contact you or request additional information (such as your
        name, email address, or telephone number) to verify your identity.
      </p>

      <p>
        Once your identity is verified, we will respond to your request to the
        extent permitted by law. If we&apos;re unable to verify your identity,
        we may ask for more information or deny your request. If we can&apos;t
        fulfill your request completely, we will provide you with further
        details explaining why.Please note that certain personal information may
        be exempt from these requests under applicable law. Additionally, we
        require certain types of personal information to provide our products
        and services. If you request deletion of such information, you may no
        longer be able to access or use our products and services.
      </p>

      <h3>6. The Right to Nondiscrimination</h3>
      <p>
        Consumers have the right to be free from discrimination for exercising
        their CCPA rights.
      </p>
      <p>
        We will not deny, charge different prices for, or provide a different
        level of quality of goods or services with respect to Consumers who
        choose to exercise their CCPA rights.
      </p>

      <h3>7. Authorized Agents</h3>
      <p>
        If you designate an agent to make CCPA requests on your behalf, we will
        verify both your identity and your agent&apos;s authorization to act on
        your behalf. We may request a signed written authorization or a copy of
        a power of attorney to verify the agent&apos;s authority.
      </p>

      <h3>8. “Shine the Light”</h3>
      <p>
        If you are a California resident, you have the right to request a list
        of third parties that received your personal information for direct
        marketing purposes in the previous year. This list will include the
        types of personal information shared. We provide this list at no cost.
        To request this information, please contact us via the Site.
      </p>

      <h2>ADDITIONAL DISCLOSURES FOR INDIVIDUALS IN EUROPE</h2>
      <p>
        If you are located in the European Economic Area (“EEA”), the United
        Kingdom, or Switzerland, you have certain rights and protections under
        the law regarding the processing of your personal data, and this section
        applies to you.
      </p>

      <h3>1. Legal Basis for Processing</h3>
      <p>
        When we process your personal data, we will do so in reliance on the
        following lawful bases:
      </p>
      <ul>
        <li>
          To perform our responsibilities under our contract with you (e.g.,
          processing payments for and providing the products and services you
          requested).
        </li>
        <li>
          When we have a legitimate interest in processing your personal data to
          operate our business or protect our interests (e.g., to provide,
          maintain, and improve our products and services, conduct data
          analytics, and communicate with you).
        </li>
        <li>
          To comply with our legal obligations (e.g., to maintain a record of
          your consents and track those who have opted out of communications).
        </li>
        <li>
          When we have your consent to do so (e.g., when you opt in to receive
          communications from us). When consent is the legal basis for our
          processing your personal data, you may withdraw such consent at any
          time.
        </li>
      </ul>

      <h3>2. Data Retention</h3>
      <p>
        We store other personal data for as long as necessary to carry out the
        purposes for which we originally collected it and for other legitimate
        business purposes, including to meet our legal, regulatory, or other
        compliance obligations.
      </p>

      <h3>3. Data Subject Requests</h3>
      <p>
        Subject to certain limitations, you have the right to request access to
        the personal data we hold about you and to receive your data in a
        portable format, the right to ask that your personal data be corrected
        or erased, and the right to object to, or request that we restrict,
        certain processing. If you would like to exercise any of these rights,
        please contact us at{' '}
        <Link href={`mailto:${SUPPORT_EMAIL_ADDRESS}`}>
          {SUPPORT_EMAIL_ADDRESS}
        </Link>
        .
      </p>

      <h3>4. Questions or Complaints</h3>
      <p>
        If you have a concern about our processing of personal data that we are
        not able to resolve, you have the right to lodge a complaint with the
        Data Protection Authority where you reside. Contact details for your
        Data Protection Authority can be found using the links below:
      </p>
      <ul>
        <li>
          For individuals in the EEA:{' '}
          <Link href="https://edpb.europa.eu/about-edpb/board/members_en">
            https://edpb.europa.eu/about-edpb/board/members_en
          </Link>
        </li>
        <li>
          For individuals in the UK:{' '}
          <Link href="https://ico.org.uk/global/contact-us/">
            https://ico.org.uk/global/contact-us/
          </Link>
        </li>
        <li>
          For individuals in Switzerland:{' '}
          <Link
            className="hyphens-auto"
            href="https://www.edoeb.admin.ch/edoeb/en/home/the-fdpic/contact.html">
            https://www.edoeb.admin.ch/edoeb/en/home/the-fdpic/contact.html
          </Link>
        </li>
      </ul>

      <h2>UPDATES TO THIS PRIVACY POLICY</h2>
      <p>
        We will update this Privacy Policy from time to time. When we make
        changes to this Privacy Policy we will change the date at the beginning
        of this Privacy Policy. If we make material changes to this Privacy
        Policy, we will notify individuals by email to their registered email
        address, by prominent posting on our services, or through other
        appropriate communication channels. All changes shall be effective from
        the date of publication unless otherwise provided.
      </p>

      <h2>CONTACT US</h2>
      <p>
        If you have any questions or requests in connection with this Privacy
        Policy or other privacy-related matters, please send an email to{' '}
        <Link href={`mailto:${SUPPORT_EMAIL_ADDRESS}`}>
          {SUPPORT_EMAIL_ADDRESS}
        </Link>
        .
      </p>
    </section>
  );
}
