import chai from 'chai';
import * as plugiator from 'plugiator';
import remi from 'remi';
import addResults from '../src/remi-topmarks-results';

chai.should();

describe('plugin addResults', () => {
  let mainApp;
  let registrator;
  let opts;

  beforeEach(() => {
    mainApp = {};
    opts = { url: 'http://topcoat.io', pageId: 'Topcoat' };
    registrator = remi(mainApp);
    registrator.hook(addResults());
  });

  it('should add results', (done) => {
    const plugin = plugiator.create('plugin', (app, options, next) => {
      app.addResults('foo');
      next();
    });
    return registrator
      .register({ register: plugin, options: opts })
      .then(() => mainApp.results.length.should.eq(1))
      .then(() => done())
      .catch(done);
  });

  it('should have a plugin namespace in results', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      app.addResults('foo');
      app.results[0].plugin.should.eq('fooPlugin');
      next();
    });

    return registrator
      .register({ register: plugin, options: opts })
      .then(() => mainApp.results[0].plugin.should.eq('fooPlugin'))
      .then(() => done())
      .catch(done);
  });

  it('should not camel case the plugin namespace', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      app.addResults('foo');
      app.results[0].plugin.should.eq('foo-plugin');
      next();
    });

    const registratorAlt = remi(mainApp);
    registratorAlt.hook(addResults({ camelCase: false }));

    return registratorAlt.register({ register: plugin, options: opts })
      .then(() => mainApp.results[0].plugin.should.eq('foo-plugin'))
      .then(() => done())
      .catch(done);
  });

  it('should share the plugin namespace through register invocations', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      app.addResults('foo');
      app.results[0].plugin.should.eq('fooPlugin');
      next();
    });

    return registrator
      .register({ register: plugin, options: opts })
      .then(() => {
        mainApp.results[0].plugin.should.eq('fooPlugin');
        return registrator.register({ register: plugiator.noop(), options: opts });
      })
      .then(() => {
        mainApp.results.should.not.equal(undefined);
        mainApp.results[0].plugin.should.eq('fooPlugin');
      })
      .then(() => done())
      .catch(done);
  });

  it('should return results that were just added', (done) => {
    const plugin = plugiator.create('plugin', (app, options, next) => {
      const results = app.addResults('foo');
      results.plugin.should.equal('plugin');
      results.report.should.equal('foo');
      next();
    });
    return registrator
      .register({ register: plugin })
      .then(() => done())
      .catch(done);
  });

  describe('results', () => {
    it('should have url', (done) => {
      const plugin = plugiator.create('plugin', (app, options, next) => {
        app.addResults('foo');
        next();
      });
      return registrator
        .register({ register: plugin, options: opts })
        .then(() => mainApp.results[0].url.should.eq(opts.url))
        .then(() => done())
        .catch(done);
    });

    it('should have timestamp', (done) => {
      const plugin = plugiator.create('plugin', (app, options, next) => {
        app.addResults('foo');
        next();
      });
      return registrator
        .register({ register: plugin, options: opts })
        .then(() => mainApp.results[0].timestamp.should.not.be.undefined)
        .then(() => done())
        .catch(done);
    });

    it('should add specific timestamp if specified', (done) => {
      const plugin = plugiator.create('plugin', (app, options, next) => {
        app.addResults('foo', '2014-10-23');
        next();
      });
      return registrator
        .register({ register: plugin })
        .then(() => mainApp.results[0].timestamp.should.eq(1414022400000))
        .then(() => done())
        .catch(done);
    });

    it('should have report', (done) => {
      const plugin = plugiator.create('plugin', (app, options, next) => {
        app.addResults('foo');
        next();
      });
      return registrator
        .register({ register: plugin, options: opts })
        .then(() => mainApp.results[0].report.should.eq('foo'))
        .then(() => done())
        .catch(done);
    });

    it('should add results without url', (done) => {
      const plugin = plugiator.create('plugin', (app, options, next) => {
        app.addResults('foo');
        next();
      });
      return registrator
        .register({ register: plugin })
        .then(() => mainApp.results[0].report.should.eq('foo'))
        .then(() => mainApp.results[0].hasOwnProperty('url').should.be.false)
        .then(() => done())
        .catch(done);
    });

    it('should add results without pageId', (done) => {
      const plugin = plugiator.create('plugin', (app, options, next) => {
        app.addResults('foo');
        next();
      });
      return registrator
        .register({ register: plugin })
        .then(() => mainApp.results[0].report.should.eq('foo'))
        .then(() => mainApp.results[0].hasOwnProperty('pageId').should.be.false)
        .then(() => done())
        .catch(done);
    });
  });
});
