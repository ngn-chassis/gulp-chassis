const Chassis = require('@chassis/core')
const gutil = require('gulp-util')
const through = require('through2')

module.exports = function (cfg) {
	cfg = cfg || {}

	let proc = new Chassis(cfg)

	return through.obj((file, enc, cb) => {
		let filename = file.relative.split('/').pop()

		if (filename.startsWith('_')) {
			cb(null)
			return
		}

		if (file.isNull()) {
			cb(null, file)
			return
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-chassis', 'Streaming is not supported!'))
			return
		}

		proc.process(file.contents, (err, processed) => {
			if (err) {
				console.error(err)
				return this.emit('error', new gutil.PluginError('gulp-chassis', 'Error processing CSS'))
			}

		  file.contents = new Buffer(processed)
      cb(null, file)
		}, file.path)
	})
}
