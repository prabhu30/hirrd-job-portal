import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase.from("companies").select("*");

    if (error) {
        console.error("Error occrured while fetching companies: ", error);
        return null;
    }

    return data;
}

export async function postCompany(token, _, companyData) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 10000);
    const fileName = `company-${random}-${companyData.name}`;

    const { error: storageError } = await supabase.storage.from("company-logo").upload(fileName, companyData.logo);

    if (storageError) {
        throw new Error("Error occurred while uploading company logo: ", storageError);
    }

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;
    const { data, error } = await supabase.from("companies").insert([
        {
            name: companyData.name,
            logo_url,
        },
    ]).select();

    if (error) {
        console.error("Error occurred while submitting company: ", error);
        return null;
    }

    return data;
}