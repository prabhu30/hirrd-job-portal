import { getSavedJobs } from "@/api/jobsApi";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { MoonLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobsData,
    fn: savedJobsFn,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      savedJobsFn();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobsData?.length ? (
            savedJobsData.map((savedJob) => {
              return (
                <JobCard
                  key={savedJob.id}
                  job={savedJob.job}
                  savedInit={true}
                  onJobSaved={savedJobsFn}
                />
              );
            })
          ) : (
            <div>No Saved Jobs Found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
