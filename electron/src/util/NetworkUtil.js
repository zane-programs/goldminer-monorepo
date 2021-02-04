const net = require("net");

module.exports = class NetworkUtil {
  static getFreePort() {
    return new Promise((resolve, reject) => {
      try {
        const srv = net.createServer();
        srv.listen(0, () => {
          const portNum = srv.address().port;
          srv.close(); // stop temp server
          resolve(portNum);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};
