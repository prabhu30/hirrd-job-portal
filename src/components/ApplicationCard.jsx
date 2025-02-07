import {
  Boxes,
  BriefcaseBusiness,
  CircleEllipsis,
  Clock,
  Download,
  School,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useFetch from "@/hooks/useFetch";
import { updateApplications } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: hiringStatusFn } = useFetch(
    updateApplications,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    hiringStatusFn(status);
  };

  return (
    <Card className="px-5 py-3 w-max">
      {loadingHiringStatus && (
        <BarLoader width={"100%"} color="#36d7b7" className="mb-3" />
      )}
      <CardHeader className="p-0">
        <CardTitle className="flex justify-between items-center font-semibold text-2xl text-purple-400">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            className="bg-white text-black rounded-full h-8 w-8 ml-5 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 mt-3">
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex gap-3 items-center">
            <BriefcaseBusiness size={18} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-3 items-center">
            <School size={18} /> {application?.education}
          </div>
          <div className="flex gap-3 items-center">
            <Boxes size={18} /> Skills :{" "}
            {application?.skills?.split(",").join(", ")}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 py-2">
        <div className="flex flex-col gap-2 justify-center">
          <span className="flex gap-3 items-center">
            <Clock size={18} />
            <span>{new Date(application?.created_at).toLocaleString()}</span>
          </span>
          <span className="flex gap-3 items-center pt-2">
            <CircleEllipsis className="h-8 w-8" />
            <span className="font-semibold text-amber-300 w-28">Status :</span>
            {isCandidate ? (
              <span className="uppercase">{application?.status}</span>
            ) : (
              <Select
                onValueChange={handleStatusChange}
                defaultValue={application.status}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="application status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
