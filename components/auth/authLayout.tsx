import { Image } from "@heroui/react";
import { Divider } from "@heroui/divider";

interface Props {
  children: React.ReactNode;
}

export const AuthLayoutWrapper = ({ children }: Props) => {
  return (
    <div className='flex h-screen bg-[#F7F7F7]'>
      <div className='flex-1 flex-col flex items-center justify-center p-6'>
        <div className='md:hidden absolute left-0 right-0 bottom-0 top-0 z-0'>
          <Image
            className='w-full h-full'
            src='https://nextui.org/gradients/docs-right.png'
            alt='gradient'
          />
        </div>
        {children}
      </div>
{/* 
      <div className='hidden my-10 md:block'>
        <Divider orientation='vertical' />
      </div> */}

      {/* <div className='hidden md:flex flex-1 relative items-center justify-center p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black'> */}
      {/* Background Image */}
      {/* <div className='absolute inset-0 z-0'>
        <img
          className='w-full h-full object-cover opacity-80'
          src='/login-bg.webp'
          alt='Marketing Dashboard Background'
        />
      </div> */}

      {/* Content */}
      {/* <div className='z-10 max-w-lg text-center bg-opacity-50 bg-black rounded-lg p-8 shadow-lg'>
        <h1 className='font-bold text-4xl md:text-5xl text-yellow-400 leading-tight'>
          SA Marketing 
        </h1>
        <p className='font-light text-slate-100 mt-6 text-lg leading-relaxed'>
          Kelola penjualan dan tingkatkan produktivitas tim dalam satu platform terintegrasi.
        </p>
      </div> */}
    {/* </div> */}
    </div>
  );
};
