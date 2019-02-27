SELECT 
  id,
  user_group_id,
  name,
  active
FROM user_group
WHERE (${ids}::bigint[] IS NULL OR id = ANY (${ids}::bigint[]))
  AND (
    ${userGroupId} IS NULL 
    OR id = ${userGroupId}
    OR user_group_id = ${userGroupId}
  )
  AND (
    ${query} IS NULL
    OR name ILIKE ${query}
  )
  AND (
    ${active} IS NULL
    OR active = ${active}
  ) 
ORDER BY name
OFFSET ${offset}
LIMIT ${limit}
