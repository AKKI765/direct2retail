module.exports = {
  reactScriptsVersion: "react-scripts",
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (webpackConfig.mode === 'development') {
        // Add source-map-loader rule for JavaScript files
        webpackConfig.module.rules.push({
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        });

        // Initialize webpackConfig.ignoreWarnings if it's not defined
        if (!webpackConfig.ignoreWarnings) {
          webpackConfig.ignoreWarnings = [];
        }

        // Ignore specific warnings
        webpackConfig.ignoreWarnings.push({
          message: /Failed to parse source map/,
        });
      }
      
      return webpackConfig;
    },
  },
};
