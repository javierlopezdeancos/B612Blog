const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc")
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const markdownIt = require("markdown-it")
const markdownItClass = require("@toycode/markdown-it-class")
const { eleventyImagePlugin } = require("@11ty/eleventy-img")

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles")

  const markdownParserOptions = {
    html: true,
    breaks: true,
    linkify: false,
  }

  const mapping = {
    p: "hggs-text",
    a: "hggs-link",
    h1: "hggs-h1",
    h2: "hggs-h2",
    h3: "hggs-h3",
    h4: "hggs-h4",
    h5: "hggs-h5",
    h6: "hggs-h6",
    ul: "hggs-list",
    ol: "hggs-list",
    li: "hggs-list-item",
    blockquote: "hggs-blockquote",
    code: "hggs-code",
    pre: "hggs-pre",
  }

  eleventyConfig.setLibrary(
    "md",
    markdownIt(markdownParserOptions).use(markdownItClass, mapping)
  )

  const english = new Intl.DateTimeFormat("en")

  eleventyConfig.addCollection("post", function (collectionApi) {
    return collectionApi.getFilteredByTags("post").reverse()
  })

  eleventyConfig.addFilter("niceDate", function (uglyDate) {
    return english.format(uglyDate)
  })

  eleventyConfig.addPlugin(eleventyImagePlugin, {
    // Set global default options
    formats: ["webp", "jpeg", "png"],
    urlPath: "/img/",

    // Notably `outputDir` is resolved automatically
    // to the project output directory

    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  })

  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: [
      "src/components/**/*.webc",
      "npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc",
      "npm:@11ty/eleventy-img/*.webc",
    ],
    layouts: "src/layouts/*.webc",
  })

  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.setServerOptions({
    liveReload: true,
    domDiff: true,
    port: 8080,
    watch: [],
    showAllHosts: false,
    encoding: "utf-8",
    showVersion: false,
  })

  return {
    dir: {
      // ⚠️ These values are both relative to your input directory.
      includes: "_includes",
      layouts: "src/layouts",
    },
  }
}
