'use strict'

const chai = require('chai')
const progressEventAssertion = require('./progress-event.assertion.js')

const expect = chai.expect
const should = chai.should()
const Job = require('../index.js')

chai.use(progressEventAssertion);

describe('Job Class', () => {
  const testJob = {
    name: 'foo-job',
    total: 10,
    jobObject: { foo: 'bar' },
  }

  let job;

  beforeEach(() => {
    job = new Job(testJob.name, testJob.total, testJob.jobObject)
  })

  it('instantiates in the correct state', () => {
    expect(job).to.be.ok
    job.should.have.property('name')
    job.should.have.property('total')
    job.should.have.property('loaded')
    job.should.have.property('jobObject')

    job.name.should.equal(testJob.name)
    job.total.should.equal(testJob.total)
    job.loaded.should.equal(0)
    job.jobObject.should.deep.equal(testJob.jobObject)
  })

  it('fires a loadstart event when start is called', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.type.should.equal('loadstart')
      done()
    })

    job.start()
  })

  it('fires a progress event when progress is called', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.type.should.equal('progress')
      done()
    })

    job.progress()
  })

  it('fires an error event when error is called', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.type.should.equal('error')
      done()
    })

    job.error()
  })

  it('fires an abort event when abort is called', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.type.should.equal('abort')
      done()
    })

    job.abort()
  })

  it('fires a load event when success is called', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.type.should.equal('load')
      done()
    })

    job.success()
  })

  it('fires a loadend event when stop is called', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.type.should.equal('loadend')
      done()
    })

    job.stop()
  })

  it('increments the loaded count by 1 when a progress event is emitted', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.progress.total.should.equal(testJob.total)
      status.progress.loaded.should.equal(1)
      done()
    })

    job.progress()
  })

  it('includes the job name when emitting an event', done => {
    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.name.should.equal(testJob.name)
      done()
    })

    job.start()
  })

  it('includes any payload passed as arg. when emitting an event', done => {
    const testPayload = { hello: 'world' }

    job.on('status', status => {
      status.should.be.a.progressEventStatus
      status.payload.should.deep.equal(testPayload)
      done()
    })

    job.start(testPayload)
  })

  it('returns the last emitted status', done => {
    job.on('status', status => {
      const lastStatus = job.getLastEmittedStatus()

      lastStatus.should.be.a.progressEventStatus
      lastStatus.type.should.equal('loadstart')
      done()
    })

    job.start()
  })
})
