module.exports = function(request) {
  if (!request || typeof request !== "string") return {};

  var result = {};

  let header = request.replace(/\r/g, '').split("\n\n")[0]
  header.split("\n").forEach(function(row,index) {
    if (index===0) row = 'firstline: '+row;
    var index = row.indexOf(":"),
      key = row.slice(0, index).toLowerCase(),
      value = row[index+1]===' '?row.slice(index + 2):row.slice(index + 1);
    if (typeof result[key] === 'undefined') {
      result[key] = value;
    } else if (typeof result[key] === 'array') {
      result[key].push(value);
    } else {
      result[key] = [result[key], value];
    }
  });
  return result;
};
