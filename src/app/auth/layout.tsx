import { ModeToggle } from "@/components";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-gradient-to-r from-blue-800 via-sky-700 to-blue-800 dark:from-slate-800 dark:via-gray-700 dark:to-slate-800">
      <div className="flex justify-end p-5">
        <ModeToggle />
      </div>
      <div className="h-[90%] flex justify-center items-center">{children}</div>
    </div>
  );
};
export default AuthLayout;
