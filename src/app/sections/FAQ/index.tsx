import styles from '@/app/sections/FAQ/FAQ.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

interface FAQItem {
  title: string;
  content: React.ReactNode;
}

const FAQ = () => {
  return (
    <SectionWrapper
      title="FAQ"
      anchorId="faq">
      <section className="mt-9 flex flex-col gap-3">
        {[
          {
            title: 'Is my data secure with PublicAI?',
            content: (
              <>
                <p>
                  Yes, PublicAI prioritizes data security and privacy. We have
                  implemented robust measures to ensure customer data remains
                  safe and secure.
                </p>
                <br />
                <p>
                  Our platform features multiple layers of security, including:
                </p>
                <br />
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Access controls to limit data access</li>
                </ul>
                <br />
                <p>
                  We also enforce strict policies and procedures for employees
                  and annotators to follow best practices in data security and
                  privacy.
                </p>
              </>
            ),
          },
          {
            title: 'How does pricing work? Can I just pay-as-I-go?',
            content: (
              <>
                <p>
                  There are two types of service options. If you choose the
                  PublicAI marketplace, you can get a free tier that provides a
                  complimentary amount of annotation, and you can pay-as-you-go
                  for anything exceeding that amount. This means you only pay
                  for what you use.
                </p>
                <br />
                <p>
                  To access additional features and enterprise capabilities, you
                  can upgrade to PublicAI Pro for Enterprise.
                </p>
              </>
            ),
          },
          {
            title:
              'Do I get charged based on the number of annotators / labelers working on my project?',
            content: (
              <p>
                No! Every service option comes with unlimited annotation team
                members. You only get charged for the work that your annotators
                complete.
              </p>
            ),
          },
          {
            title: 'What data types are supported on PublicAI?',
            content: (
              <>
                <p>PublicAI V1 supports various data types, including:</p>
                <br />
                <ul>
                  <li>General image annotation</li>
                  <li>2D semantic segmentation</li>
                  <li>Text collection</li>
                  <li>Document transcription</li>
                  <li>Named entity recognition</li>
                  <li>Video playback annotation</li>
                  <li>LIDAR (3D) annotation</li>
                </ul>
              </>
            ),
          },
          {
            title:
              'What are the advantages of PublicAI over other crowdsourcing task platforms?',
            content: (
              <>
                <p>
                  PublicAI has several advantages over centralized crowdsourcing
                  platforms like Mturk and Appen:
                </p>
                <br />
                <ul>
                  <li>Eliminates price differentials, reducing task costs</li>
                  <li>
                    WEB3 reputation system with incentives and penalties
                    promotes virtuous growth
                  </li>
                  <li>
                    Crypto payment channel solves international labor settlement
                    obstacles, welcoming global members
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: 'Who can join the PublicAI ecosystem?',
            content: (
              <>
                <p>The PublicAI ecosystem includes various roles:</p>
                <br />
                <ul>
                  <li>Task publishers</li>
                  <li>Workers</li>
                  <li>Job reviewers</li>
                  <li>Labeling guilds</li>
                  <li>Approvers</li>
                  <li>Councils</li>
                </ul>
                <br />
                <p>You can:</p>
                <br />
                <ul>
                  <li>Publish tasks via PublicAI in various service modes</li>
                  <li>Join the labor force and complete tasks for payment</li>
                  <li>
                    Join as a labeling service provider (guild) to offer Pro
                    services
                  </li>
                </ul>
              </>
            ),
          },
        ].map((item, index) => (
          <Collapsible
            key={index}
            item={item}
          />
        ))}
      </section>
    </SectionWrapper>
  );
};

interface CollapsibleProps extends React.ComponentProps<'div'> {
  item: FAQItem;
}

const Collapsible = (props: CollapsibleProps) => {
  const { className, item, ...rest } = props;
  return (
    <div
      className={cn(
        styles.collapsible,
        'frosted-card hover:bg-primary cursor-pointer rounded-xl transition-colors',
        className,
      )}
      {...rest}>
      <details>
        <summary className="text-base font-medium text-white md:text-lg lg:text-xl">
          {item.title}
        </summary>
      </details>
      <div>
        <span className="mx-2 text-sm font-normal text-white md:text-base lg:text-lg">
          {item.content}
        </span>
      </div>
    </div>
  );
};

export default FAQ;
