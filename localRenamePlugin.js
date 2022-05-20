/*
 * @Date: 2022-05-20 15:31:17
 * @LastEditors: 水光 wanli.zhang@perfma.com
 * @LastEditTime: 2022-05-20 15:31:25
 * @FilePath: /cssLoader/Users/zhangwanli/code/localRenamePlugin/localRenamePlugin.js
 */

const fs = require("fs");
const { fullPath } = require("../utils/index");

class localRenamePlugin {
  // 构造函数
  constructor(options) {
    console.log("localRenamePlugin", options);
  }

  // 应用函数
  apply (compiler) {
    const _this = this;

    compiler.hooks.done.tap(
      { name: "localRenamePlugin" },
      (compliation, callback) => {
        const output = fullPath("dist/kodo-template.html");
        fs.rename(fullPath("dist/index.html"), output, (err) => {
          if (err) {
            console.log(err);
          }
          fs.readFile(output, "utf-8", (err, data) => {
            const res = data
              .replace(
                `content="width=device-width,initial-scale=1">`,
                `content="width=device-width,initial-scale=1">
                  <script type="text/javascript">
                    window._kodo_data_ = {{ data | safe }};
                  </script>
                  <title>
                    {{title}}
                  </title>
                  {{head | safe}}
                  {{toc_js | safe}}
                  `
              )
              .replace(
                '<div class="kodo-body-html-container">',
                '<div class="kodo-body-html-container">{{body_html | safe}}'
              );

            fs.writeFile(output, res, { encoding: "utf8" }, (err) => {
              if (err) {
                console.log(err);
              }
              console.log("success");
            });
          });
        });
      }
    );
  }
}

module.exports = localRenamePlugin;
