import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getLearningRecords = async () => {
  const { data, error } = await supabase.from("records").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};

export const saveLearningRecord = async (content: string, time: number) => {
  const { data, error } = await supabase
    .from("records")
    .insert({ content, time })
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return {
    id: data[0].id,
    content: data[0].content,
    time: data[0].time,
  };
};
