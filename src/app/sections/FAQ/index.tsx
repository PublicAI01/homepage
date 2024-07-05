import clsx from 'clsx';
import type { FC } from 'react';

import styles from '@/app/sections/FAQ/FAQ.module.css';
import SectionWrapper from '@/components/SectionWrapper';

interface FAQItem {
	title: string;
	content: string;
}

const FAQ = () => {
	return (
		<SectionWrapper
			title="FAQ"
			anchorId="faq">
			<section className="flex flex-col gap-3 mt-9">
				{[
					{
						title: 'Is my data secure with PublicAI?',
						content:
							"Yes, PublicAI takes data security and privacy very seriously and has implemented various measures to ensure that customer data is kept safe and secure.  PublicAI's platform is built with multiple layers of security to protect customer data, including encryption of data both in transit and at rest, and access controls to limit who can access the data. We also have strict policies and procedures in place to ensure that the employees and annotators follow best practices for data security and privacy.",
					},
					{
						title: 'How does pricing work? Can I just pay-as-I-go?',
						content:
							'There are two types of service options. If you choose the PublicAI marketplace, you can get a free tier that provides a complimentary amount of annotation, and you can pay-as-you-go for anything exceeding that amount. To access additional features, you can upgrade to PublicAI Pro for Enterprise capabilities.',
					},
					{
						title:
							'Do I get charged based on the number of annotators / labelers working on my project?',
						content:
							'No! Every service option can come with unlimited annotation team members. You only get charged for the work that your annotators complete.',
					},
					{
						title: 'What data types are supported on PublicAI?',
						content:
							'PublicAI V1 will support general image annotation, 2D semantic segmentation, text collection, document transcription, named entity recognition, video playback annotation, and LIDAR (3D) annotation.',
					},
					{
						title:
							'What are the advantages of PublicAI over other crowdsourcing task platforms?',
						content:
							'PublicAI has the following advantages over centralised crowdsourcing platforms such as Mturk and Appen: first, it eliminates the huge price differentials that middlemen earn, which in turn reduces the cost of tasks; second, the WEB3 reputation system with incentive and penalty mechanisms makes DAO develop in a virtuous circle; third, the Crypto payment channel is used to solve the international labor settlement obstacles, and make it readily welcome the international members to join the ecosystem and so on.',
					},
					{
						title: 'Who can join the PublicAI ecosystem?',
						content:
							'The PublicAI ecosystem includes roles such as task publishers, workers, job reviewers, labeling guilds, approvers, and councils. If you need labeling tasks completed, you can publish tasks via PublicAI in a variety of service modes; if you want to make money from PublicAI, you can join the PublicAI labor force and take tasks. We also welcome labeling service providers to join in the form of guilds to provide Pro services to the demand side.',
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

const Collapsible: FC<{ item: FAQItem }> = ({ item }) => {
	return (
		<article
			className={clsx(
				styles.collapsible,
				'rounded-xl cursor-pointer transition-colors frosted-card hover:bg-primary',
			)}>
			<details>
				<summary className="text-lg font-medium text-white lg:text-xl">
					{item.title}
				</summary>
			</details>
			<div>
				<p className="text-base font-normal text-white lg:text-lg">
					{item.content}
				</p>
			</div>
		</article>
	);
};

export default FAQ;
