import { QUERY_KEY } from "@/constants/enums";
import { getUserProfile } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useUserProfileQuery = () =>
  useQuery({
    queryKey: [QUERY_KEY.USER_DATA],
    queryFn: getUserProfile,
    staleTime: 3000,
  });
