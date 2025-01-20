import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
    const supabase = await supabaseClient(token);

    let query = supabase.from("jobs").select("*, company:companies(name, logo_url), saved:saved_jobs(id)");

    if (location) {
        query = query.eq("location", location);
    }

    if (company_id) {
        query = query.eq("company_id", company_id);
    }

    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error occrured while fetching jobs: ", error);
        return null;
    }

    return data;
}


export async function saveJob(token, { unsaveJob }, jobData) {
    const supabase = await supabaseClient(token);

    if (unsaveJob) {
        const { data, error: deleteSavedJobError } = await supabase.from("saved_jobs").delete().eq("job_id", jobData.job_id);

        if (deleteSavedJobError) {
            console.error("Error occurred while deleting saved job: ", deleteSavedJobError);
            return null;
        }
        return data;
    } else {
        const { data, error: insertSavedJobError } = await supabase.from("saved_jobs").insert([jobData]).select();

        if (insertSavedJobError) {
            console.error("Error occurred while inserting saved job: ", insertSavedJobError);
            return null;
        }
        return data;
    }
}

export async function getJob(token, { job_id }) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(name, logo_url), applications:applications(*)")
        .eq("id", job_id)
        .single();

    if (error) {
        console.error("Error occrured while fetching a job: ", error);
        return null;
    }

    return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .update({ isOpen })
        .eq("id", job_id)
        .select();

    if (error) {
        console.error("Error occurred while updating hiring status: ", error);
        return null;
    }
    return data;
}

export async function postJob(token, _, jobData) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .insert([jobData])
        .select();

    if (error) {
        console.error("Error occurred while creating a new job: ", error);
        return null;
    }
    return data;
}

export async function getSavedJobs(token) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job:jobs(*, company:companies(name, logo_url))");

    if (error) {
        console.error("Error occurred while fetching saved jobs for the current user: ", error);
        return null;
    }
    return data;
}

export async function getMyJobs(token, { recruiter_id }) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(name, logo_url)")
        .eq("recruiter_id", recruiter_id);

    if (error) {
        console.error("Error occurred while fetching job postings: ", error);
        return null;
    }
    return data;
}


export async function deleteJob(token, { job_id }) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id)
        .select();

    if (error) {
        console.error("Error occurred while deleting job posting: ", error);
        return null;
    }
    return data;
}