import camelCase from 'camelcase';

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
