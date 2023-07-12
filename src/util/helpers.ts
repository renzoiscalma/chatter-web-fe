const validateYtUrl = (url: string): boolean => {
  let p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return url.match(p) ? true : false;
};

const validateUsername = (username: string): boolean => {
  return username.trim().length <= 36 && username.trim().length >= 3;
};

export { validateYtUrl, validateUsername };
