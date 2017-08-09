'use strict'

const EventEmitter = require('events').EventEmitter

class Job extends EventEmitter {
  constructor(name, total, jobObject = null) {
    super()
    this.name = name
    this.total = total
    this.loaded = 0
    this.jobObject = jobObject;
  }

  getJobObject() {
    return this.jobObject;
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
    const status = {
      name: this.name,
      type,
      progress: {
        total: this.total,
        loaded: this.loaded
      },
      payload: payload || null
    }

    this._setLastEmittedStatus(status).emit('status', status)
  }

  getLastEmittedStatus() {
    return this.lastStatus
  }

  _setLastEmittedStatus(status) {
    this.lastStatus = status

    return this
  }
}

module.exports = Job
