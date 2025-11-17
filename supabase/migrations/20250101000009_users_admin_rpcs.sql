-- RPCs for admin-safe users operations

CREATE OR REPLACE FUNCTION get_all_users()
RETURNS SETOF profiles
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT p
  FROM profiles p
  WHERE EXISTS (
    SELECT 1 FROM profiles me WHERE me.id = auth.uid() AND COALESCE(me.is_admin, false) = true
  )
  ORDER BY p.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION set_user_admin(target_id uuid, make_admin boolean)
RETURNS profiles
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE profiles AS p
  SET is_admin = make_admin, updated_at = now()
  WHERE p.id = target_id
  AND EXISTS (
    SELECT 1 FROM profiles me WHERE me.id = auth.uid() AND COALESCE(me.is_admin, false) = true
  )
  RETURNING p;
$$;

GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION set_user_admin(uuid, boolean) TO authenticated;