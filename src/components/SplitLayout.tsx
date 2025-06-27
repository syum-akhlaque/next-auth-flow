// components/AuthLayout.tsx
import Image from "next/image";

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="flex flex-col w-full md:w-1/2 px-6">
        <div className="mt-6 mb-8">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        {/* Form container */}
        <div className="flex flex-col justify-center flex-grow">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 relative bg-gray-50 ">
        <Image
          src="/bg-img.png"
          alt="Auth Side Image"
          fill
          className="object-cover p-6 rounded-[30px]"
          priority
        />
      </div>
    </div>
  );
}
