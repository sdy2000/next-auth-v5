"use client";

import { buttonVariants } from "@/components/ui/button";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingPage = () => {
  const user = useCurrentUser();

  return (
    <div>
      {JSON.stringify(user)}
      <button
        onClick={() => logout()}
        type="submit"
        className={buttonVariants()}
      >
        Sing out
      </button>
    </div>
  );
};
export default SettingPage;
