INSERT INTO user_group (
  name, 
  user_group_id, 
  active
)
VALUES (
  ${name}, 
  ${userGroupId},
  ${active}
)
RETURNING
  id
