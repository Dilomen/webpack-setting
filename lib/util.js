const fs = require("fs");
let ejs = require("ejs");
const path = require("path");
const os = require("os");

// 获取绝对位置
const getAbsPath = (relFilePath = "") =>
  path.resolve(process.cwd(), relFilePath);

// 如果项目最外层没有index.html，生成一个html文件
function createTemplete(configRelactivePath = '') {
  const sereinConfig = require(path.resolve(process.cwd(), configRelactivePath || "./serein.config.js"));
  const { CDN_CSS = [], CDN_JS = [] } = (sereinConfig || {});
  let tempExist = fs.existsSync(path.resolve(process.cwd(), "./index.html"));
  if (!tempExist) {
    try {
      let template = fs.readFileSync(path.resolve(__dirname + "/template"), {
        encoding: "utf-8",
      });
      fs.writeFileSync(
        path.resolve(__dirname, "./index.html"),
        ejs.render(template, { CDN_CSS, CDN_JS })
      );
    } catch (err) {
      throw new Error("未能生成默认模板文件");
    }
  }
}

// 获取本地ip地址
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

module.exports = {
  createTemplete,
  getAbsPath,
  getIPAdress
};
