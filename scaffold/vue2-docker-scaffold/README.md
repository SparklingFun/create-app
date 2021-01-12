# Vue Docker Template (SPA)

## CHANGELOG

- v1.0.1
  - 移除`vue-style-loader`，修复`mini-css-extact-plugin`对于document的报错;

- v1.0.0
  - 优化npmhook执行，在内部没有依赖时跳过合并package.json;
  - 调整Dockerfile内依赖的node镜像，修改为LTS的alpine版本;
  - 更新有关npm包依赖;
  - 修复webpack在解析基于缩进的sass文件没有正确识别的问题（sass-loader文档）;