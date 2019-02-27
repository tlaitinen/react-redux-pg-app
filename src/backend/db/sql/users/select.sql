SELECT 
  id,
  email,
  user_group_id,
  admin,
  group_admin,
  first_name,
  last_name,
  language,
  active
FROM "user" AS u
WHERE (${ids}::bigint[] IS NULL OR id = ANY (${ids}::bigint[]))
  AND (
    ${userGroupId}::bigint IS NULL
    OR user_group_id = ${userGroupId}
   )
  AND (${email} IS NULL OR email = ${email})
  AND (
    ${query} IS NULL 
    OR first_name ILIKE ${query}
    OR last_name ILIKE ${query}
    OR email ILIKE ${query}
  )
  AND (
    ${active} IS NULL
    OR active = ${active}
  )
ORDER BY email
OFFSET ${offset}
LIMIT ${limit}

