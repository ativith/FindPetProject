// hooks/usePosts.js
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const fetchPost = async (filters) => {
  let query = supabase.from("post").select("*");

  if (filters?.typeofpost) query = query.eq("typeofpost", filters.typeofpost);
  if (filters?.petType) query = query.eq("type", filters.petType);
  if (filters?.species) query = query.eq("species", filters.species);
  if (filters?.sex) query = query.eq("sex", filters.sex);
  if (filters?.collar) query = query.eq("collar", filters.collar);
  console.log(filters.collar);
  if (filters?.color && filters.color.length > 0) {
    query = query.contains("color", JSON.parse(JSON.stringify(filters.color)));
  }
  console.log(filters.color);
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export function usePosts(filters) {
  return useQuery({
    queryKey: ["post", filters], //เเยก cache ตาม filter
    queryFn: () => fetchPost(filters),
    keepPreviousData: true,
  });
}
