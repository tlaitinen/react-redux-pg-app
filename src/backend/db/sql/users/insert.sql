INSERT INTO "user" (
  email,
  user_group_id,
  admin,
  group_admin,
  first_name,
  last_name,
  language,
  active
) VALUES (
  ${email},
  ${userGroupId},
  ${admin},
  ${groupAdmin},
  ${firstName},
  ${lastName},
  ${language},
  ${active}
) RETURNING 
  id
