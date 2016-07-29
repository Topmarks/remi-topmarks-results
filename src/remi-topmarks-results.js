import camelCase from 'camelcase';

export default function (opts) {
  opts = opts || {}

  function getPluginName(plugin) {
    if (opts.camelCase === false) return plugin.name

    return camelCase(plugin.name)
  }

  return (next, target, plugin, cb) => {
    const pluginName = getPluginName(plugin)

    target.results = target.results || []
    target.root.results = target.results

    next(Object.assign({}, target, {
      addResults(report, timestamp = false) {
        let results = {};
        if (plugin.options.hasOwnProperty('pageId')) results.pageId = plugin.options.pageId
        results.plugin = pluginName;
        if (plugin.options.hasOwnProperty('url')) results.url = plugin.options.url;
        results.timestamp = (timestamp)? timestamp: Date.now();
        results.report = report;
        target.results.push(results);
      },
    }), plugin, cb)
  }
}
