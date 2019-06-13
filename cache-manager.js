var fs = require("fs");
const cacheDir = './cache/'
module.exports = class {
  constructor(){
      this.cache={}
      if (!fs.existsSync(cacheDir))
      fs.mkdirSync(cacheDir);
      //setInterval(()=>this.cache={},5000)
  }
  check(host, firstline) {
    let name = host + ' ' + firstline
    name = name.replace(/[^\w\s]/gi, '')
    return !!this.cache[name]
  }
  push(host, firstline, stream){
    let name = host + ' ' + firstline
    name = name.replace(/[^\w\s]/gi, '')
    fs.writeFile(cacheDir+name,stream,()=>this.cache[name]=true)
  }
  get(host, firstline){
    let name = host + ' ' + firstline
    name = name.replace(/[^\w\s]/gi, '')
    let data
    if (this.cache[name]===true){
      data = fs.readFileSync(cacheDir+name)
    }
    return data
  }
};
