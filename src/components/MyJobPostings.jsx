import { getMyJobs } from "@/api/jobsApi";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { MoonLoader } from "react-spinners";
import JobCard from "./JobCard";

const MyJobPostings = () => {
  const { user } = useUser();

  const {
    loading: loadingJobPostings,
    data: myJobPostingsData,
    fn: getMyJobPostingsFn,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    getMyJobPostingsFn();
  }, []);

  if (loadingJobPostings) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  return (
    <div>
      <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myJobPostingsData?.length ? (
          myJobPostingsData.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                onJobSaved={getMyJobPostingsFn}
                isMyJob
              />
            );
          })
        ) : (
          <div>No Jobs Found.</div>
        )}
      </div>
    </div>
  );
};

export default MyJobPostings;
