//Регулярное выражение лучше вынести в константу в отдельный файл и импортировать в нужных местах.
// Так, в случае ошибки, не нужно будет исправлять его в нескольких местах
const urlRegex = new RegExp(
  /^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/
);

module.exports = urlRegex
