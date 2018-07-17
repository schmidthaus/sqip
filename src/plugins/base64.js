const encodeBase64 = rawSVG => Buffer.from(rawSVG).toString('base64')

class Base64EncodePlugin {
  constructor(options) {
    this.options = options || { wrapImageTag: true }
  }

  apply(svg) {
    const shouldWrap = this.options.wrapImageTag
    const base64svg = encodeBase64(svg)

    if (shouldWrap) {
      return this.wrapImageTag(base64svg)
    } else {
      return base64svg
    }
  }

  wrapImageTag(svg) {
    const {
      dimensions: { width, height },
      filename
    } = this.options

    return `<img width="${width}" height="${height}" src="${filename}" alt="Add descriptive alt text" style="background-size: cover; background-image: url(data:image/svg+xml;base64,${svg});">`
  }
}

module.exports = Base64EncodePlugin
