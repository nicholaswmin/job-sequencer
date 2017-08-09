'use strict'

const chai = require('chai')

const expect = chai.expect
const should = chai.should()

const JobSequencer = require('../index.js')

describe('Job Sequencer', () => {
  let jobSequencer

  beforeEach(() => {
    jobSequencer = new JobSequencer()
  })

  it('it instantiates', () => {
    jobSequencer.should.be.ok
  })

  describe('when a Job is created', () => {
    it('creates a Running Job', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })
      job.constructor.name.should.equal('Job')
    })

    it('throws an exception when attempting to create a Running Job whilst another Running Job with the same name is still running', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      expect(jobSequencer.createJob.bind(
        jobSequencer, 'foo-job',
        10, { foo: 'bar' })
      ).to.throw();
    })

    it('returns a Running Job by name if it exists', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })
      const queriedJob = jobSequencer.getRunningJobByName('foo-job')

      queriedJob.should.be.ok
      queriedJob.should.be.an('Object')
      queriedJob.should.deep.equal(job)
    })

    it('returns true if a Running Job exists by name', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })
      const runningJobExists = jobSequencer.hasRunningJob('foo-job')

      runningJobExists.should.be.a('Boolean')
      runningJobExists.should.be.ok
    })

    it('returns a list of all the last statuses emitted by still running, Running Jobs', () => {
      const job1 = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })
      const job2 = jobSequencer.createJob('bar-job', 10, { foo: 'bar' })

      job1.start()
      job2.start()

      const lastStatuses = jobSequencer.getLastRunningJobStatuses()

      lastStatuses.should.be.an('Array')
      lastStatuses.should.have.length(2)
    })

    it('clears the Running Job if the job has succeeded', () => {
      let queriedJob
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.be.ok

      job.start()
      job.progress()
      job.progress()
      job.success()

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.not.be.ok
    })

    it('clears the Running Job if the job is errored', () => {
      let queriedJob
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.be.ok

      job.start()
      job.progress()
      job.progress()
      job.error()

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.not.be.ok
    })

    it('clears the Running Job if the job is aborted', () => {
      let queriedJob
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.be.ok

      job.start()
      job.progress()
      job.progress()
      job.abort()

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.not.be.ok
    })

    it('clears the Running Job if the job is stopped', () => {
      let queriedJob
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.be.ok

      job.start()
      job.progress()
      job.progress()
      job.stop()

      queriedJob = jobSequencer.getRunningJobByName('foo-job')
      expect(queriedJob).to.not.be.ok
    })
  })

  describe('when attempting to create a Job whilst another is running', () => {
    it('throws an exception', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      expect(jobSequencer.createJob.bind(
        jobSequencer, 'foo-job',
        10, { foo: 'bar' })
      ).to.throw();
    })

    it('creates the Job if the Job is done', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      job.success()

      expect(jobSequencer.createJob.bind(
        jobSequencer, 'foo-job',
        10, { foo: 'bar' })
      ).not.to.throw();
    })

    it('creates the Job if the Job is errored', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      job.error()

      expect(jobSequencer.createJob.bind(
        jobSequencer, 'foo-job',
        10, { foo: 'bar' })
      ).not.to.throw();
    })

    it('creates the Job if the Job is aborted', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      job.error()

      expect(jobSequencer.createJob.bind(
        jobSequencer, 'foo-job',
        10, { foo: 'bar' })
      ).not.to.throw();
    })

    it('creates the Job if the Job is stopped', () => {
      const job = jobSequencer.createJob('foo-job', 10, { foo: 'bar' })

      job.stop()

      expect(jobSequencer.createJob.bind(
        jobSequencer, 'foo-job',
        10, { foo: 'bar' })
      ).not.to.throw();
    })
  })
})
