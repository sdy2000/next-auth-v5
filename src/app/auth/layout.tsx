import { ModeToggle } from "@/components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-custom">
      <div className="flex justify-end p-5">
        <ModeToggle />
      </div>
      <div className="h-[90%] flex justify-center items-center">{children}</div>
    </div>
  );
};
export default AuthLayout;
