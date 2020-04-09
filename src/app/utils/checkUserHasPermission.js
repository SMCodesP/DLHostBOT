module.exports = function checkUserHasPermission(perm, user) {
  return user.hasPermission(perm);
};
