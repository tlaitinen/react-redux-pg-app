CREATE TABLE user_group (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  user_group_id bigint REFERENCES user_group (id),
  active boolean
);

CREATE TABLE "user" (
  id bigserial PRIMARY KEY,
  email text NOT NULL,
  password text,
  user_group_id bigint REFERENCES user_group (id),
  admin boolean NOT NULL,
  group_admin boolean NOT NULL,
  first_name text,
  last_name text,
  language text NOT NULL,
  active boolean
);
