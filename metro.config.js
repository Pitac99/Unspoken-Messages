const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  minifierPath: 'metro-minify-terser',
  minifierConfig: {
    // Optimization options
    compress: {
      reduce_funcs: false,
      keep_infinity: true,
      drop_console: false,
    }
  }
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
  extraNodeModules: {
    '@': path.resolve(__dirname, './client/src'),
    '@assets': path.resolve(__dirname, './assets')
  },
  // Improve module resolution
  useWatchman: true,
  // Cache configuration
  enableGlobalPackages: true
};

// Performance optimizations
config.maxWorkers = 4;
config.resetCache = false;
config.cacheVersion = '1.0';

// Server configuration
config.server = {
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Allow connections from all origins
      res.setHeader("Access-Control-Allow-Origin", "*");
      return middleware(req, res, next);
    };
  }
};

module.exports = config;