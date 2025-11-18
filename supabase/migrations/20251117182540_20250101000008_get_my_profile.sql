-- RPC to fetch the current user's profile safely

CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS profiles
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT p
  FROM profiles p
  WHERE p.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION get_my_profile() TO authenticated;
