'use strict'

module.exports = (chai, utils) => {
  utils.addProperty(chai.Assertion.prototype, 'progressEventStatus', function () {
    this.assert(
      Boolean(this._obj),
      'expected #{this} to be ok'
    )

    this.assert(
      this._obj.hasOwnProperty('name'),
      'expected #{this} to have a property name'
    )

    this.assert(
      this._obj.hasOwnProperty('type'),
      'expected #{this} to have a property type'
    )

    this.assert(
      this._obj.hasOwnProperty('progress'),
      'expected #{this} to have a property progress'
    )

    this.assert(
      this._obj.hasOwnProperty('payload'),
      'expected #{this} to have a property payload'
    )

    this.assert(
      typeof this._obj.name === 'string',
      'expected #{this}.name to be a String'
    )

    this.assert(
      typeof this._obj.type === 'string',
      'expected #{this}.type to be a String'
    )

    this.assert(
      typeof this._obj.progress === 'object',
      'expected #{this}.type to be an Object'
    )

    this.assert(
      this._obj.progress.hasOwnProperty('total'),
      'expected #{this} to have a property total'
    )

    this.assert(
      this._obj.progress.hasOwnProperty('loaded'),
      'expected #{this} to have a property loaded'
    )

    this.assert(
      typeof this._obj.progress.total === 'number',
      'expected #{this}.progress.total to be a Number'
    )

    this.assert(
      typeof this._obj.progress.loaded === 'number',
      'expected #{this}.progress.loaded to be a Number'
    )

    this.assert(
      this._obj.hasOwnProperty('payload'),
      'expected #{this} to have a property payload'
    )
  });
}
