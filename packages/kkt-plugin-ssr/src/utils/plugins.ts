import webpack from "webpack"
import { WebpackConfiguration, MiniCssExtractPlugin } from 'kkt';
const SimpleProgressWebpackPlugin = require('@kkt/simple-progress-webpack-plugin');


export const getWebpackRunPlugins = (plugins: WebpackConfiguration["plugins"]) => {
  // 过滤 不用的插件
  let newPlugins: webpack.Configuration['plugins'] = [
    new SimpleProgressWebpackPlugin({
      format: 'compact',
      name: 'Server',
    }),
  ];

  (plugins || []).forEach((plugin) => {
    if (
      !(
        plugin &&
        plugin.constructor &&
        ['HtmlWebpackPlugin', 'SSRWebpackPlugin', 'SSRWebpackRunPlugin', 'WebpackManifestPlugin'].includes(
          plugin.constructor.name,
        )
      )
    ) {
      newPlugins?.push(plugin);
    }
  });
  return newPlugins;
}

// 为了 开发模式下生成 css 文件
export const getCSSPlugins = (plugins: WebpackConfiguration["plugins"], isEnvDevelopment: boolean, cssFilename: string = "server") => {
  if (isEnvDevelopment) {
    // 为了让开发模式下生成 css 文件
    plugins.push(new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${cssFilename}.css`,
    }))
  }
  return plugins;
}