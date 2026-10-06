const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// withUniwindConfig must stay the outermost wrapper (Uniwind docs: Metro config).
module.exports = withUniwindConfig(config, {
  // Relative path to the CSS entry file; it is also the token source of truth.
  cssEntryFile: './src/global.css',
  // Generated on Metro start; inside src/ so TypeScript picks it up automatically.
  dtsFile: './src/uniwind-types.d.ts',
  // Explicit 1rem = 16px (Uniwind default) so token math in global.css is unambiguous.
  polyfills: { rem: 16 },
});
