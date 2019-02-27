UPDATE "user"
SET 
  email = ${email},
  user_group_id = ${userGroupId},
  admin = ${admin},
  group_admin = ${groupAdmin},
  first_name = ${firstName},
  last_name = ${lastName},
  language = ${language},
  active = ${active}
WHERE
  id = ${id}

