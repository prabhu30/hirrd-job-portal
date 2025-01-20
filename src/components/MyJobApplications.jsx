import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { MoonLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const MyJobApplications = () => {
  const { user } = useUser();

  const {
    data: applications,
    loading: loadingApplications,
    fn: getApplicationsFn,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    getApplicationsFn();
  }, []);

  if (loadingApplications) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {applications?.map((application) => {
        return (
          <div key={application.id}>
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate
            />
          </div>
        );
      })}
    </div>
  );
};

export default MyJobApplications;
