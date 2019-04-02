/* eslint-env node */
'use strict';

/**
 * Please *do not* import this file in your project. We put this here for
 * backwards compatibility reasons with the ember-decorators main package.
 *
 * This is explicitly private API and not intended for use inside third-party
 * addons.
 *
 * If you find yourself in need of importing this file, because babel-transforms
 * does not serve your special use case, please open an issue instead and let us
 * find a solution. :)
 */

const path = require('path');
const VersionChecker = require('ember-cli-version-checker');

function requireTransform(transformName) {
  let plugin = require(transformName);

  plugin = plugin.__esModule ? plugin.default : plugin;

  // adding `baseDir` ensures that broccoli-babel-transpiler does not
  // issue a warning and opt out of caching
  const pluginPath = require.resolve(`${transformName}/package`);
  const pluginBaseDir = path.dirname(pluginPath);
  plugin.baseDir = () => pluginBaseDir;

  return plugin;
}

function hasPlugin(plugins, name) {
  for (const maybePlugin of plugins) {
    const plugin = Array.isArray(maybePlugin) ? maybePlugin[0] : maybePlugin;
    const pluginName = typeof plugin === 'string' ? plugin : plugin.name;

    if (pluginName === name) {
      return true;
    }
  }

  return false;
}

module.exports = function setupBabel(parent) {
  // Create parent options, if they do not exist
  const parentOptions = (parent.options = parent.options || {});

  const checker = new VersionChecker(parent).for('ember-cli-babel', 'npm');

  if (checker.satisfies('^6.0.0-beta.1')) {
    const TransformDecoratorsLegacy = requireTransform(
      'babel-plugin-transform-decorators-legacy'
    );
    const TransformClassProperties = requireTransform(
      'babel-plugin-transform-class-properties'
    );

    // Create babel options if they do not exist
    parentOptions.babel = parentOptions.babel || {};

    // Create and pull off babel plugins
    const plugins = (parentOptions.babel.plugins =
      parentOptions.babel.plugins || []);

    if (!hasPlugin(plugins, 'transform-decorators-legacy')) {
      // unshift the transform because it always must come before class properties
      plugins.unshift(TransformDecoratorsLegacy);
    }

    if (!hasPlugin('transform-class-properties')) {
      plugins.push(TransformClassProperties);
    }
  } else {
    parent.project.ui.writeWarnLine(
      '@ember-decorators/babel-transforms: You are using an unsupported ember-cli-babel version, decorator/class-property transforms will not be included automatically'
    );
  }
};
