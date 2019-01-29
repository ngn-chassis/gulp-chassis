const through = require('through2')
const path = require('path')
const fs = require('fs-extra')
const gutil = require('gulp-util')

const Chassis = require('@chassis/core')

module.exports = function (cfg) {
	cfg = cfg || {}

	let chassis = new Chassis(cfg)

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file)
		}

		if (file.isStream()) {
			return cb(new gutil.PluginError('gulp-chassis', 'Streaming is not supported!'))
		}

		if (path.basename(file.path).startsWith('_')) {
      return cb()
    }

		chassis.process(file.path, (err, processed) => {
			let { settings } = chassis

			if (err) {
				return cb(err)
			}

			if (settings.minify && settings.sourceMap) {
				if (!settings.sourceMapPath) {
					return cb(new gutil.PluginError('gulp-chassis', 'No source map path specified! Please add a "sourceMapPath" property to your Chassis configuration object.'))
				}

				fs.outputFile(path.join(settings.sourceMapPath, `${file.relative}.map`), new Buffer(processed.sourceMap), err => err && console.error(err))
			}

		  file.contents = new Buffer.from(processed.css)
      return cb(null, file)

		}, file.path)
	})
}
