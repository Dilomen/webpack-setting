const fs = require("fs");
let ejs = require("ejs");
const path = require("path");
const package_json = require(path.resolve(process.cwd(), "./package.json"));
const { config = {} } = package_json;
const { CDN_CSS = [], CDN_JS = [] } = config;

// 获取绝对位置
const getAbsPath = (relFilePath = "") =>
  path.resolve(process.cwd(), relFilePath);

// 检测文件是否存在
function checkFileExist(pathname) {
  pathname = pathname || path.resolve(process.cwd(), "./index.html");
  return fs.existsSync(path.resolve(process.cwd(), pathname), (isExist) => {
    if (!isExist) {
      return false;
    }
    return true;
  });
}

// 将package.json中config的alias的属性值（字符串）转为js
function createAliasObj(alias) {
  let aliasPathName;
  Object.keys(alias).map((key) => {
    try {
      aliasPathName = eval(alias[key]);
    } catch (e) {
      throw new Error("alias的属性值出错", e);
    }
    checkFileExist(aliasPathName);
    alias[key] = aliasPathName;
  });
  return alias;
}

// 如果项目最外层没有index.html，生成一个html文件
function createTemplete() {
  let tempExist = checkFileExist(path.resolve(process.cwd(), "./index.html"));
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

module.exports = {
  checkFileExist,
  createAliasObj,
  createTemplete,
  getAbsPath,
};
