'use strict'

const EventEmitter = require('events').EventEmitter

class Job extends EventEmitter {
  constructor(name, total) {
    super()
    this.name = name
    this.total = total
    this.loaded = 0
  }

  getName() {
    return this.name
  }

  start(payload) {
    this.emitStatus('loadstart', payload)
  }

  progress(payload) {
    this.loaded++
    this.emitStatus('progress', payload)
  }

  error(payload) {
    this.emitStatus('error', payload)
  }

  abort(payload) {
    this.emitStatus('abort', payload)
  }

  success(payload) {
    this.loaded = this.total;
    this.emitStatus('load', payload)
  }

  stop(payload) {
    this.emitStatus('loadend', payload)
  }

  emitStatus(type, payload) {
    this.emit('status', {
      name: this.name,
      type,
      progress: {
        total: this.total,
        loaded: this.loaded
      },
      payload: payload || null
    })
  }
}

class JobSequencer extends EventEmitter {
  constructor() {
    super()

    this.runningJobs = []
  }

  createJob(jobName, total) {
    if (this.runningJobExists(jobName)) {
      throw new Error(`A ${jobName} is already running`);
    }

    const job = new Job(jobName, total)

    job.on('status', (status) => {
      this.broadcastStatus(job, status);
    })

    this.addRunningJob(job)

    return job
  }

  broadcastStatus(job, status) {
    this.emit('status', status)

    if (this.shouldClearRunningJob(status.type)) {
      this.clearRunningJob(job)
    }
  }

  shouldClearRunningJob(emmitedEventType) {
    return ['abort', 'load', 'loadend', 'error'].some(clearJobEventType => {
      return clearJobEventType === emmitedEventType
    });
  }

  runningJobExists(name) {
    return this.runningJobs.find(job => job.getName() == name)
  }

  addRunningJob(job) {
    this.runningJobs.push(job)
  }

  clearRunningJob(job) {
    job.removeListener('status', this.broadcastStatus.bind(this))
    this.runningJobs = this.runningJobs.filter(runningJob => runningJob.getName() !== job.getName())
  }
}

class BatchSearchService extends JobSequencer {
  constructor() {
    super()
  }

  run() {
    const job = this.createJob('batch-search-status', 10)

    job.start()
    job.progress()
    job.progress()
    job.progress()
    job.success({
      hello: 'world'
    })

    const job2 = this.createJob('batch-search-status', 10)
  }
}

const batchSearchService = new BatchSearchService
batchSearchService.on('status', status => {
  console.log(status)
})

batchSearchService.run()
