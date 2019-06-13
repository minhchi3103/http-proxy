net = require('net');
PaH = require('./parse-header');
blacklist = require('./load-blacklist')
denyReq = require('./load-deny')
Cache = require('./cache-manager')
cache = new Cache()
console.log(blacklist)

const server = net.createServer(socket => {
  socket.on('error', (error) => console.log(error));
  socket.on('end', () => console.log('A client disconnected'));
  socket.on('data', stream => {
    let data = stream.toString().replace(/\r/g, '')
    let header = PaH(data);
    console.log(header)
    console.log('-------------------------------------------------------')
    if (blacklist.includes(header['host'])) {
      console.log('domain in blacklist')
      socket.write(denyReq)
    }
    else if(cache.check(header['host'], header['firstline'])){
      console.log('load from cache')
      socket.write(cache.get(header['host'], header['firstline']))
    }
    else {
      console.log('not in cache')
      let _cache=[];
      let _socket = new net.Socket();
      _hInfo = header['host'].split(':')
      let opts = {
        host: _hInfo[0],
        port: _hInfo[1] ? _hInfo[1] : 80
      }
      _socket.setTimeout(5000);
      _socket.on('timeout', () => {
        console.log('Web socket timeout');
        _socket.end();
      });
      _socket.connect(opts, function () {
        _socket.write(stream);
      });
      _socket.on('error', (err) => console.log('download error\n' + err))
      _socket.on('data', function (chunk) {
        socket.write(chunk)
        _cache.push(chunk)
      });
      _socket.on('end', () => cache.push(header['host'], header['firstline'], Buffer.concat(_cache)))
    }
  })
})

server.on('error', (err) => {
  console.log(err)
});
server.listen(8888, () => {
  console.log('Proxy server starting...');
})