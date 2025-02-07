import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  async function handleRoleSelection(role) {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "candidate" ? "/jobs" : "/job/create");
      })
      .catch((error) => {
        console.error("Error occurred while onboarding user :", error);
      });
  }

  useEffect(() => {
    if (user?.unsafeMetadata.role) {
      navigate(
        user?.unsafeMetadata.role === "recruiter" ? "/job/create" : "/jobs"
      );
    }
  });

  if (!isLoaded) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-12 grid grid-cols-2 gap-8 w-full md:px-40">
        <Button
          variant="blue"
          className="h-24 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-24 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
