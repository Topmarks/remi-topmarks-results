import {expect} from 'chai'
import chai from 'chai'
import * as plugiator from 'plugiator'
import remi from 'remi'
import addResults from '../src/remi-topmarks-results'

describe('plugin addResults', () => {
  let app
  let registrator
  let opts = {url: "http://topcoat.io", pageId: 'Topcoat'}

  beforeEach(() => {
    app = {}
    registrator = remi(app)
    registrator.hook(addResults())
  })

  it('should add results', (done) => {
    const plugin = plugiator.create('plugin', (app, opts, next) => {
      app.addResults('foo')
      next()
    })
    return registrator
      .register({ register: plugin, options: opts})
      .then(() => expect(app.results.length).to.eq(1))
      .then(() => done())
      .catch(done)
  })

  it('should have a plugin namespace in results', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      app.addResults('foo')
      expect(app.results[0].plugin).to.eq('fooPlugin')
      next()
    })

    return registrator
      .register({ register: plugin, options: opts})
      .then(() => expect(app.results[0].plugin).to.eq('fooPlugin'))
      .then(() => done())
      .catch(done)
  })

  it('should not camel case the plugin namespace', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      app.addResults('foo')
      expect(app.results[0].plugin).to.eq('foo-plugin')
      next()
    })

    const registrator = remi(app)
    registrator.hook(addResults({ camelCase: false }))

    return registrator.register({ register: plugin, options: opts})
      .then(() => expect(app.results[0].plugin).to.eq('foo-plugin'))
      .then(() => done())
      .catch(done)
  })

  it('should share the plugin namespace through register invocations', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      app.addResults('foo')
      expect(app.results[0].plugin).to.eq('fooPlugin')
      next()
    })

    return registrator
      .register({ register: plugin, options: opts})
      .then(() => {
        expect(app.results[0].plugin).to.eq('fooPlugin')

        return registrator.register({ register: plugiator.noop(), options: opts})
      })
      .then(() => {
        expect(app.results).to.be.not.undefined
        expect(app.results[0].plugin).to.eq('fooPlugin')
      })
      .then(() => done())
      .catch(done)
  })

  describe('results', () => {

    it('should have url', (done) => {
      const plugin = plugiator.create('plugin', (app, opts, next) => {
        app.addResults('foo')
        next()
      })
      return registrator
        .register({ register: plugin, options: opts})
        .then(() => expect(app.results[0].url).to.eq(opts.url))
        .then(() => done())
        .catch(done)
    })

    it('should have timestamp', (done) => {
      const plugin = plugiator.create('plugin', (app, opts, next) => {
        app.addResults('foo')
        next()
      })
      return registrator
        .register({ register: plugin, options: opts})
        .then(() => expect(app.results[0].timestamp).to.be.not.undefined)
        .then(() => done())
        .catch(done)
    })

    it('should add specific timestamp if specified', (done) => {
      const plugin = plugiator.create('plugin', (app, opts, next) => {
        app.addResults('foo', '2014-10-23')
        next()
      })
      return registrator
        .register({ register: plugin })
        .then(() => expect(app.results[0].timestamp).to.eq(1414022400000))
        .then(() => done())
        .catch(done)
    })

    it('should have report', (done) => {
      const plugin = plugiator.create('plugin', (app, opts, next) => {
        app.addResults('foo')
        next()
      })
      return registrator
        .register({ register: plugin, options: opts})
        .then(() => expect(app.results[0].report).to.eq('foo'))
        .then(() => done())
        .catch(done)
    })

    it('should add results without url', (done) => {
      const plugin = plugiator.create('plugin', (app, opts, next) => {
        app.addResults('foo')
        next()
      })
      return registrator
        .register({ register: plugin })
        .then(() => expect(app.results[0].report).to.eq('foo'))
        .then(() => expect(app.results[0].url).to.be.undefined)
        .then(() => done())
        .catch(done)
    })

    it('should add results without pageId', (done) => {
      const plugin = plugiator.create('plugin', (app, opts, next) => {
        app.addResults('foo')
        next()
      })
      return registrator
        .register({ register: plugin })
        .then(() => expect(app.results[0].report).to.eq('foo'))
        .then(() => expect(app.results[0].pageId).to.be.undefined)
        .then(() => done())
        .catch(done)
    })

  })
})
