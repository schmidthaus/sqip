const SVGO = require('svgo')

// SVGO with settings for maximum compression to optimize the Primitive-generated SVG
class SVGOPlugin {
  constructor(options) {
    this.options = options || {}
  }
  apply(svg) {
    return this.optimize(svg)
  }
  optimize(svg) {
    const { multipass = true, floatPrecision = 1 } = this.options

    const svgo = new SVGO({ multipass, floatPrecision })
    let retVal = ''
    svgo.optimize(svg, ({ data }) => (retVal = data))
    return retVal
  }
}

module.exports = SVGOPlugin
