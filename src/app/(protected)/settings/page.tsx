import { auth, signOut } from "@/auth";
import { buttonVariants } from "@/components/ui/button";

const SettingPage = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button type="submit" className={buttonVariants()}>
          Sing out
        </button>
      </form>
    </div>
  );
};
export default SettingPage;
