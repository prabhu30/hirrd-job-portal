import { getJob, updateHiringStatus } from "@/api/jobsApi";
import ApplicationCard from "@/components/ApplicationCard";
import ApplyJobDrawer from "@/components/ApplyJobDrawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const Job = () => {
  const { user, isLoaded } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: jobFn,
  } = useFetch(getJob, {
    job_id: id,
  });

  const { loading: loadingHiringStatus, fn: hiringStatusFn } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleJobStatusChange = (value) => {
    const isOpen = value === "open";
    hiringStatusFn(isOpen).then(() => jobFn());
  };

  console.log(job);

  useEffect(() => {
    if (isLoaded) jobFn();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex flex-wrap gap-8 justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} Applications
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>

        {/* Hiring Status */}
        {loadingHiringStatus && (
          <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
        )}
        {job?.recruiter_id === user?.id && (
          <Select onValueChange={handleJobStatusChange}>
            <SelectTrigger
              className={`w-max -mt-3 ${
                job?.isOpen ? "bg-green-900" : "bg-red-900"
              }`}
            >
              <SelectValue
                placeholder={`Hiring Status : ${
                  job?.isOpen ? "Open" : "Closed"
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-blue-300 mt-5">
        About the job
      </h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold mt-5 text-blue-300">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg"
      />

      {/* render applications */}
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={jobFn}
          applied={job?.applications?.find(
            (application) => application.candidate_id === user.id
          )}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mt-3 mb-2">
            Applications
          </h2>
          <div className="flex gap-3 flex-wrap">
            {job?.applications?.map((application) => {
              return (
                <div key={application.id}>
                  <ApplicationCard
                    key={application.id}
                    application={application}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Job;
