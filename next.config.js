const composePlugins = require("next-compose-plugins")
const typescript = require("@zeit/next-typescript")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const images = require("next-images")
const css = require("@zeit/next-css")

const json = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { isServer } = options
      if (!options.defaultLoaders) {
        throw new Error(
          "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
        )
      }

      const assetPrefix = nextConfig.assetPrefix || ""

      config.module.rules.push({
        test: /\.json$/,
        use: [
          {
            loader: "json-loader",
            options: {
              fallback: "file-loader",
              publicPath: `${assetPrefix}/_next/static/`,
              outputPath: `${isServer ? "../" : ""}static/`,
              name: "[name]-[hash].[ext]",
            },
          },
        ],
      })

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}

const nextConfig = {
  exportPathMap: async function(defaultPathMap) {
    return {
      "/": { page: "/" },
    }
  },
}

module.exports = composePlugins(
  [
    [
      typescript,
      {
        webpack(config, options) {
          // Do not run type checking twice:
          if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())

          return config
        },
      },
    ],
    [json],
    [images],
    [css],
  ],
  nextConfig
)
