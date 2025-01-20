import { useUser } from "@clerk/clerk-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCities } from "countries-cities";
import useFetch from "@/hooks/useFetch";
import { getCompanies } from "@/api/apiCompanies";
import { useEffect } from "react";
import { BarLoader, MoonLoader } from "react-spinners";
import { data, Navigate, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { postJob } from "@/api/jobsApi";
import AddCompany from "@/components/AddCompany";

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required and cannot be empty" }),
  description: z
    .string()
    .min(1, { message: "Description is required and cannot be empty" }),
  location: z
    .string()
    .min(1, { message: "Location is required and cannot be empty" }),
  company_id: z.string().min(1, { message: "Select or Add a new company" }),
  requirements: z
    .string()
    .min(1, { message: "Requirements are required and cannot be empty" }),
});

const CreateJob = () => {
  const cities = getCities("India");
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const { user, isLoaded } = useUser();
  console.log(user);

  const {
    fn: companiesFn,
    loading: loadingCompanies,
    data: companies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) companiesFn();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: createJobError,
    data: createJobData,
    fn: createJobFn,
  } = useFetch(postJob);

  const onSubmit = (data) => {
    createJobFn({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (createJobData?.length > 0) {
      navigate("/jobs");
    }
  }, [loadingCreateJob]);

  if (!isLoaded || loadingCompanies) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a new Job
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Label className="text-xl">Job Title</Label>
        <Input
          placeholder="Enter title of the job (React Developer, Data Analyst, etc...)"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Label className="text-xl">Description</Label>
        <Textarea
          placeholder="Enter job description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Label className="text-xl">Job Location</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  className="border border-white"
                >
                  <SelectTrigger className="px-4 mt-3 border border-gray-600">
                    <SelectValue placeholder="Filter by Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cities?.map((name) => {
                        return (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex-1">
            <Label className="text-xl">Company Name</Label>
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="px-4 mt-3 border border-gray-600">
                    <SelectValue placeholder="Filter by Company">
                      {field.value
                        ? companies?.find(
                            (company) => company.id === Number(field.value)
                          )?.name
                        : "Company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies?.map(({ name, id }) => {
                        return (
                          <SelectItem key={name} value={id}>
                            {name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Add Company Drawer */}
          <AddCompany fetchCompanies={companiesFn} />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Label className="text-xl">Requirements</Label>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
              data-color-mode="dark"
            />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}

        {createJobError?.message && (
          <p className="text-red-500">{createJobError?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" size="lg" variant="blue" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateJob;
