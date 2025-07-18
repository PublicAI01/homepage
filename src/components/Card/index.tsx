import { cn } from '@/utils';

interface CardProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
  title: string;
  content: string;
}

const Card = (props: CardProps) => {
  const { className, style, children, title, content, ...rest } = props;

  return (
    <div
      className={cn(
        'bg-b2 app-card rounded-xl border border-white p-4 xl:p-6',
        className,
      )}
      {...rest}>
      {children}
      <h4 className="my-2 text-base font-bold md:my-4 md:text-xl xl:text-2xl">
        {title}
      </h4>
      <p className="text-sm font-medium md:text-base">{content}</p>
    </div>
  );
};

const Card2 = (props: CardProps) => {
  const { className, style, children, title, content, ...rest } = props;

  return (
    <div
      className={cn(
        'bg-b2 app-card flex flex-col justify-between rounded-xl rounded-se-[2.5rem] border border-white p-4 md:rounded-se-[3.125rem] xl:p-6',
        className,
      )}
      {...rest}>
      <h3 className="my-2 text-base font-bold md:my-4 md:text-xl xl:text-2xl">
        {title}
      </h3>
      <p className="text-g1 text-sm font-light md:text-base">{content}</p>
      {children}
    </div>
  );
};

export default Card;
export { Card2 };
