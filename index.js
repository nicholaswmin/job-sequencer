'use strict'

const EventEmitter = require('events').EventEmitter
const Job = require('./classes/job')

class JobSequencer extends EventEmitter {
  constructor() {
    super()

    this.runningJobs = []
  }

  createJob(jobName, total, jobObject) {
    if (this._runningJobExists(jobName)) {
      throw { status: 400, msg: `A ${jobName} is already running` };
    }

    const job = new Job(jobName, total, jobObject)

    job.on('status', (status) => {
      this.emitStatus(job, status);
    })

    this._addRunningJob(job)

    return job
  }

  emitStatus(job, status) {
    this.emit('status', status)

    if (this._shouldClearRunningJob(status.type)) {
      this._clearRunningJob(job)
    }
  }

  getRunningJobByName(jobName) {
    return this.runningJobs.find(runningJob => runningJob.getName() === jobName)
  }

  hasRunningJob(jobName) {
    return this.runningJobs.some(runningJob => runningJob.getName() === jobName)
  }

  getLastRunningJobStatuses() {
    return this.runningJobs.map(runningJob => runningJob.getLastEmittedStatus())
  }

  _runningJobExists(name) {
    return this.runningJobs.find(job => job.getName() == name)
  }

  _addRunningJob(job) {
    this.runningJobs.push(job)
  }

  _shouldClearRunningJob(emmitedEventType) {
    return ['abort', 'load', 'loadend', 'error'].some(clearJobEventType => {
      return clearJobEventType === emmitedEventType
    });
  }

  _clearRunningJob(job) {
    job.removeListener('status', this.emitStatus.bind(this))

    this.runningJobs = this.runningJobs.filter(runningJob => {
      return runningJob.getName() !== job.getName()
    })
  }
}

module.exports = JobSequencer;
