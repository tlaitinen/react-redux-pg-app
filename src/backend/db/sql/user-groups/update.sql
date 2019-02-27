UPDATE user_group
SET name=${name},
  user_group_id = ${userGroupId},
  active=${active}
WHERE id=${id}
