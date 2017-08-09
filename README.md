# Job sequencer

[![Build Status](https://travis-ci.org/nicholaswmin/job-sequencer.svg?branch=master)](https://travis-ci.org/nicholaswmin/job-sequencer)

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

Attempting to run another `Job` with the same name if the aforementioned methods
have not been called on `Job` will result in an `Exception`


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

```bash

Job Sequencer
  ✓ it instantiates
  when a Job is created
    ✓ creates a Running Job
    ✓ returns a Running Job by name if it exists
    ✓ returns true if a Running Job exists by name
    ✓ returns a list of all the last statuses emitted by still running, Running Jobs
    ✓ clears the Running Job if the job has succeeded
    ✓ clears the Running Job if the job is errored
    ✓ clears the Running Job if the job is aborted
    ✓ clears the Running Job if the job is stopped
  when attempting to create a Job whilst another is running
    ✓ throws an exception
    ✓ creates the Job if the Job is done
    ✓ creates the Job if the Job is errored
    ✓ creates the Job if the Job is aborted
    ✓ creates the Job if the Job is stopped

Job Class
  ✓ instantiates in the correct state
  ✓ fires a loadstart event when start is called
  ✓ fires a progress event when progress is called
  ✓ fires an error event when error is called
  ✓ fires an abort event when abort is called
  ✓ fires a load event when success is called
  ✓ fires a loadend event when stop is called
  ✓ increments the loaded count by 1 when a progress event is emitted
  ✓ includes the job name when emitting an event
  ✓ includes any payload passed as arg. when emitting an event
  ✓ returns the last emitted status

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
