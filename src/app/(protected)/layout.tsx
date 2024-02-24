import { Navbar } from "./_components";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center bg-custom">
      <Navbar />
      <div className="h-full w-full flex flex-col items-center justify-center max-w-[960px]">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
