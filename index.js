const through = require('through2')
const path = require('path')
const fs = require('fs-extra')
const gutil = require('gulp-util')

const Chassis = require('@chassis/core')

module.exports = function (cfg) {
	cfg = cfg || {}

	let chassis = new Chassis(cfg)
	
	return through.obj(function (file, enc, cb) {
		let slugs = file.relative.split('/')
		let filename = path.basename(file.relative)
		let filepath = slugs.slice(0, slugs.length - 1).join('/')

		if (filename.startsWith('_')) {
			return cb(null)
		}

		if (file.isNull()) {
			return cb(null, file)
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-chassis', 'Streaming is not supported!'))
		}

		chassis.process(file.contents, (err, processed) => {
			let { settings } = chassis

			if (err) {
				return cb(err)
			}

			if (settings.minify) {
				let minified = chassis.minify(processed, settings.sourceMap)

				if (settings.sourceMap) {
					if (settings.sourceMapPath) {
						fs.outputFile(path.join(settings.sourceMapPath, `${file.relative}.map`), new Buffer(minified.sourceMap.toString()), err => err && console.error(err))
					} else {
						return cb(new gutil.PluginError('gulp-chassis', 'No source map path specified! Please add a "sourceMapPath" property to your Chassis configuration object.'))
					}
				}

				processed = minified.styles
			}

		  file.contents = new Buffer(processed)
      return cb(null, file)

		}, file.path)
	})
}
