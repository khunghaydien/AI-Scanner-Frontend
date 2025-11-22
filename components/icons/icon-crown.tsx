import clsx from 'clsx';

export default function IconCrown({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('lucide lucide-crown', className)}
      {...props}
    >
      <path
        d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519L18.624 17.5a1 1 0 0 1-1.124.75H6.5a1 1 0 0 1-1.124-.75L2.02 6.02a.5.5 0 0 1 .798-.519l4.277 3.664a1 1 0 0 0 1.516-.294z"
        fill="currentColor"
        stroke="currentColor"
      />
      <path d="M5 21h14" stroke="currentColor" />
    </svg>
  );
}
