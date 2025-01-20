import MyJobApplications from "@/components/MyJobApplications";
import MyJobPostings from "@/components/MyJobPostings";
import { useUser } from "@clerk/clerk-react";
import { MoonLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Job Postings"}
      </h1>

      {user?.unsafeMetadata?.role === "candidate" ? (
        <MyJobApplications />
      ) : (
        <MyJobPostings />
      )}
    </div>
  );
};

export default MyJobs;
