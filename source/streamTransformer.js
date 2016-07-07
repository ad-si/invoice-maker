const Yaml2json = require('@adius/yaml2json')
const formatTask = require('./formatTask')

module.exports = (inputStream, outputStream) => {
  inputStream
    .pipe(new Yaml2json)
    .pipe(new stream.Transform({
      writableObjectMode: true,
      transform: function (chunk, encoding, done) {
        this.buffer = chunk
        done()
      },
      flush: function (done) {

        this.buffer.issuingDate = new Date()
        this.buffer.id = this.buffer.issuingDate
          .toISOString().substr(0, 10) + '_1'
        this.buffer.deliveryDate = this.buffer.deliveryDate ||
          this.buffer.issuingDate

        this.buffer.from = biller

        this.buffer.dueDate = new Date(this.buffer.issuingDate)
        this.buffer.dueDate.setDate(
          this.buffer.issuingDate.getDate() + 14
        )

        this.buffer.language = this.buffer.language || 'en'

        console.log(this.buffer)


        if (this.buffer.tasks) {
          this.buffer.tasks = this.buffer.tasks
            .reverse()
            .map(formatTask)

          this.buffer.taskTable = new Tabledown({
            data: this.buffer.tasks,
            alignments,
            headerTexts: headerTexts[this.buffer.language],
            capitalizeHeaders: true,
          })

          this.buffer.total = this.buffer.tasks.reduce(
            (sum, current) => sum + Number(current.price),
            0
          )
        }

        this.push(templates[this.buffer.language](this.buffer) + '\n')
        done()
      }
    }))
    .pipe(outputStream)
}
