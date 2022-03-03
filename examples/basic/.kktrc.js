import { SSRWebpackPlugin, SSRWebpackRunPlugin } from "@kkt/ssr"
import path from "path"

export default (config) => {
  config.entry = {
    main: path.join(process.cwd(), "src/index.js")
  }
  config.output = {
    ...(config.output || {}),
    path: path.join(process.cwd(), 'build'),
    filename: "[name].js",
  }
  const plugins = [new SSRWebpackRunPlugin({
    "entry": path.join(process.cwd(), "src/server"),
    "output": {
      path: path.resolve(process.cwd(), "./build"),
      filename: "server.js",
      libraryTarget: "commonjs2",
      library: {
        type: "commonjs2"
      },
    },

  })]
  config.plugins.forEach((plugin) => {
    if (!(plugin && plugin.constructor && ["HtmlWebpackPlugin"].includes(plugin.constructor.name))) {
      plugins.push(plugin)
    }
  })
  config.plugins = plugins
  return config
}