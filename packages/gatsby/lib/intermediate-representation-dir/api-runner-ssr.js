// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   require('/path/to/plugin1/gatsby-ssr.js'),
//   require('/path/to/plugin2/gatsby-ssr.js'),
// ]

module.exports = (api, args, defaultReturn) => {
  // Run each plugin in series.
  let results = plugins.map((plugin) => {
    if (plugin.plugin[api]) {
      const result = plugin.plugin[api](args, plugin.options)
      return result
    }
    return false
  })

  // Filter out undefined/falsey results.
  results = results.filter((result) => result)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}