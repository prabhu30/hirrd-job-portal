import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { applyToJob } from "@/api/apiApplications";
import { MoonLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Years of Experience must be greater than 0" })
    .int(),
  skills: z
    .string()
    .min(1, { message: "Skills are required and cannot be empty" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required and cannot be empty",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

const ApplyJobDrawer = ({ user, job, fetchJob, applied = false }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApplyJob,
    error: errorApplyJob,
    fn: applyJobFn,
  } = useFetch(applyToJob);

  const onSubmit = (data) => {
    applyJobFn({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger className="mb-8">
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (!applied ? "Apply" : "Applied") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-amber-500">
            Apply for {job?.title} Role at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below.</DrawerDescription>
        </DrawerHeader>

        {/* application form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          {/* <Label>Name</Label>
          <Input type="text" placeholder="Enter your full name" /> */}

          <Label>Years of Experience</Label>
          <Input
            type="number"
            placeholder="Enter your years of experience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <Label>What are your skills?</Label>
          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Label>What is your Educational Qualification?</Label>
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                className="flex flex-wrap gap-6"
                {...field}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Label className="mt-2">Upload your resume</Label>
          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:bg-gray-800 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}
          {errorApplyJob && (
            <p className="text-red-500">{errorApplyJob?.message}</p>
          )}
          {loadingApplyJob && (
            <MoonLoader
              className="mx-auto mt-10"
              width={"100%"}
              color="white"
            />
          )}
          <Button type="submit" variant="blue" size="lg">
            Apply
          </Button>
        </form>

        <DrawerFooter className="">
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;
