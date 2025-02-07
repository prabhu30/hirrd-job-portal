import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import useFetch from "@/hooks/useFetch";
import { postCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Company is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only JPEG or PNG Images are allowed" }
    ),
});

const AddCompany = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: addCompanyData,
    fn: addCompanyFn,
  } = useFetch(postCompany);

  const onSubmit = (data) => {
    addCompanyFn({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (addCompanyData?.length > 0) fetchCompanies();
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger className="self-end">
        <Button type="button" variant="secondary" className="h-10">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-amber-400">
            Add a new company
          </DrawerTitle>
        </DrawerHeader>

        <form className="mx-3 flex flex-wrap gap-2">
          <div className="flex-1 min-w-72">
            <Label>Company Name</Label>
            <Input
              placeholder="Enter name of the company"
              className="my-2"
              {...register("name")}
            />
          </div>

          <div className="flex-1 min-w-72">
            <Label>Upload Company Logo</Label>
            <Input
              type="file"
              accept="image/*"
              className="my-2 py-1 file:bg-gray-800 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer"
              {...register("logo")}
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40 mb-2 self-end"
          >
            Add
          </Button>
        </form>
        {errors.name && (
          <p className="text-red-500 mx-3">{errors.name.message}</p>
        )}
        {errors.logo && (
          <p className="text-red-500 mx-3">{errors.logo.message}</p>
        )}
        {errorAddCompany?.message && (
          <p className="text-red-500 mx-3">{errorAddCompany?.message}</p>
        )}
        {loadingAddCompany && (
          <BarLoader className="mt-2" width={"100%"} color="#36d7b7" />
        )}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompany;
