-- RPC to safely check admin status without triggering RLS recursion

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(p.is_admin, false)
  FROM profiles p
  WHERE p.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
