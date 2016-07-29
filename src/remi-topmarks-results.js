import camelCase from 'camelcase';

/**
 *  Public: returns remi extention that adds the `addResults` method to app/target
 *
 *  * `opts` {Object} options - supports `options.camelCase` as a boolean to set plugin name.
 *
 *  ## Example
 *
 *  Register the extension in the registration app.
 *
 *    import remi from 'remi';
 *    import remiExpose from 'remi-topmarks-results';
 *    const app = {};
 *    const registrator = remi(app);
 *    registrator.hook(addResults());
 *    registrator.register({register: require('sample-plugin')});
 *
 *  Then plugins can use the `addResults` method:
 *
 *    let samplePlugin = (app, options next) => {
 *      // do some stuff and gather the results
 *      app.addResults('foo');
 *      next();
 *    }
 *    samplePlugin.attributes = {
 *      pkg: require('../package.json')
 *    }
 *
 *  Returns Function.
 */
export default function (opts) {
  const options = opts || {};

  function getPluginName(plugin) {
    if (options.camelCase === false) return plugin.name;

    return camelCase(plugin.name);
  }
  return (next, target, plugin, cb) => {
    const pluginName = getPluginName(plugin);

    target.results = target.results || [];
    target.root.results = target.results;

    next(Object.assign({}, target, {
      /**
       * Method added to plugins.
       * @param {*} report - Any value to store as the plugin result.
       * @param {string|number} [timestamp=false] - The timestamp of when report was run.
       * If excluded or false addResults will generate a timestamp.
       */
      addResults(report, timestamp = false) {
        const result = {};
        if (plugin.options.hasOwnProperty('pageId')) result.pageId = plugin.options.pageId;
        result.plugin = pluginName;
        if (plugin.options.hasOwnProperty('url')) result.url = plugin.options.url;
        let time = new Date();
        if (timestamp) {
          time = new Date(timestamp);
        }
        result.timestamp = time.getTime();
        result.report = report;
        target.results.push(result);
        return result;
      },
    }), plugin, cb);
  };
}
