import { Navbar } from "./settings/_components";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-custom">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
