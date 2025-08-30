import Image from 'next/image';

export const Logo = ({ size = 64, className = "" }) => {
  return (
    <Image
      src="/icon.png"
      alt="Snake Lomiz Logo"
      width={size}
      height={size}
      className={`${className}`}
      priority
    />
  );
};