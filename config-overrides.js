const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    os: require.resolve("os-browserify/browser"),
    assert: require.resolve("assert/"),
    url: require.resolve("url/"),
    vm: require.resolve("vm-browserify"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
  };

  config.plugins = (config.plugins || []).concat(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  return config;
};

