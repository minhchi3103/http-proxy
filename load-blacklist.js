var fs = require('fs')
data = fs.readFileSync('./blacklist.conf')
data = data.toString().replace(/\r/g,'').split('\n').filter(row=>!row.match(/\s{0,}\/\/* /g))
module.exports = data