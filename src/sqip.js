const fs = require('fs')
const path = require('path')

const SVGPlugin = require('./plugins/svg')
const SVGOPlugin = require('./plugins/svgo')
const PrimitivePlugin = require('./plugins/primitive')
const Base64EncodePlugin = require('./plugins/base64')

const { getDimensions, printFinalResult } = require('./utils/helpers')

const sqip = options => {
  // TODO validate Options
  const config = Object.assign({}, options)
  config.filename = config.input

  if (!config.filename) {
    throw new Error(
      'Please provide an input image, e.g. sqip({ filename: "input.jpg" })'
    )
  }

  const inputPath = path.resolve(config.filename)

  try {
    fs.accessSync(inputPath, fs.constants.R_OK)
  } catch (err) {
    throw new Error(`Unable to read input file: ${inputPath}`)
  }
  const imgDimensions = getDimensions(inputPath)

  let plugins = []
  if (!config.plugins) {
    plugins = [
      new PrimitivePlugin({
        numberOfPrimitives: 8,
        mode: 0,
        filename: config.filename,
        dimensions: imgDimensions
      }),
      new SVGPlugin({
        blur: 12,
        dimensions: imgDimensions
      }),
      new SVGOPlugin({
        multipass: true,
        floatPrecision: 1
      }),
      new Base64EncodePlugin({
        dimensions: imgDimensions,
        filename: config.filename,
        wrapImageTag: true
      })
    ]
  } else {
    plugins = config.plugins
  }

  let finalSvg = config.filename
  for (let plugin of plugins) {
    finalSvg = plugin.apply(finalSvg)
  }

  // Write to disk or output result
  if (config.output) {
    const outputPath = path.resolve(config.output)
    fs.writeFileSync(outputPath, finalSvg)
  } else {
    printFinalResult(imgDimensions, inputPath, finalSvg)
  }

  return { finalSvg, imgDimensions }
}

module.exports = sqip
