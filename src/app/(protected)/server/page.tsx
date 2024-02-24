import { currentUser } from "@/lib/auth";
import { UserInfo } from "@/components";

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo label="💻 Server component" user={user} />;
};

export default ServerPage;
