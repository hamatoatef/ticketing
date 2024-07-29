import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";
import { useEffect } from "react";

function SignOut() {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest({});
  }, []);
  return <div>Signing you out ...</div>;
}

export default SignOut;
