# Job sequencer

Run long-running jobs, one at a time, whilst emitting W3C ProgressEvents

## Basic Usage

Just inherit from `JobSequencer`

```javascript

const JobSequencer = require('job-sequencer')

class LongRunningJobManager extends JobSequencer {
  constructor() {
    super()
  }

  async batchProcessFoo() {
    let batchJobFoo

    try {
      // Create a job with name 'batch-process-foo' that will tick
      // `job.progress()` 5 times
      batchJobFoo = this.createJob('batch-process-foo', 5);
      batchJobFoo.start()
      batchJobFoo.progress()
      batchJobFoo.progress()
      batchJobFoo.progress()
      batchJobFoo.progress()
      batchJobFoo.progress()
      batchJobFoo.success({ foo: 'bar' })  
    } catch (err) {
      job.error(err)
    }
  }
}

const batchProcessor = new LongRunningJobManager()

batchProcessor.on('progress', status => {
  console.log(status)
})

batchProcessor.on('load', successPayload => {
  console.log('done!', successPayload)
  // logs `{ foo: 'bar' }`
})


batchProcessor.batchProcessFoo()
```

## Sequential Running

You can only run *one job at a time*. If any of the following events are
called:

- `job.success()`
- `job.error()`
- `job.abort()`
- `job.stop()`

the `Job` is considered finished and it's ejected, thus allowing
other `Job`'s with the same name to run.


## Events Emitted

All events map to [W3C Progress Events][1]

| Method           | W3C ProgressEvent emitted |
|------------------|---------------------------|
| `job.start()`    | `loadstart`               |
| `job.progress()` | `progress`                |
| `job.error()`    | `error`                   |
| `job.abort()`    | `abort`                   |
| `job.success()`  | `load`                    |
| `job.stop()`     | `loadend`                 |

## Tests

```bash
npm test
```

## License

> Copyright 2017 Nicholas Kyriakides

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[1]: https://www.w3.org/TR/progress-events/
