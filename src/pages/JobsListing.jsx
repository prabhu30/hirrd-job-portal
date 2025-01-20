import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/jobsApi";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { getCities } from "countries-cities";

const JobsListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { user, isLoaded } = useUser();
  const cities = getCities("India");

  console.log(user);

  const {
    fn: jobsFn,
    loading: jobsLoading,
    data: jobsData,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const { fn: companiesFn, data: companiesData } = useFetch(getCompanies);

  console.log(jobsData);

  useEffect(() => {
    if (isLoaded) {
      companiesFn();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) jobsFn();
  }, [isLoaded, location, company_id, searchQuery]);

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  };

  if (!isLoaded) {
    return (
      <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search");
    if (query) setSearchQuery(query);
  };

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="h-10 flex w-full gap-2 items-center mb-4"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search"
          className="h-full flex-1 px-4 text-md border border-gray-600"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={location}
          onValueChange={(value) => setLocation(value)}
          className="border border-white"
        >
          <SelectTrigger className="px-4 border border-gray-600">
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

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger className="px-4 border border-gray-600">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companiesData?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="destructive" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {jobsLoading && (
        <MoonLoader className="mx-auto mt-10" width={"100%"} color="white" />
      )}

      {jobsLoading === false && (
        <div className="my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsData?.length ? (
            jobsData.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsListing;
