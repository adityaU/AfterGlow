/* global describe, it */

const FSMonitor = require('./');
const expect = require('chai').expect;
const fs = require('fs');
const originalStatSync = fs.statSync;

describe('FSMonitor', function() {
  it('will only allow one active instance at a time', function() {
    let monitor0 = new FSMonitor();
    let monitor1 = new FSMonitor();

    monitor0.start();
    monitor1.start();

    expect(monitor0.state, 'monitor0 (m0 active)').to.eql('active');
    expect(monitor1.state, 'monitor1 (m0 active)').to.eql('idle');

    monitor0.stop();

    monitor1.start();
    monitor0.start();

    expect(monitor0.state, 'monitor0 (m1 active)').to.eql('idle');
    expect(monitor1.state, 'monitor1 (m1 active)').to.eql('active');

    monitor1.stop();
    monitor0.stop();
  });

  describe('.prototype.stop', function() {
    it('restores fs functions to their defaults', function() {
      let monitor = new FSMonitor();

      expect(fs.statSync).to.equal(originalStatSync);

      monitor.start();
      expect(fs.statSync).to.not.equal(originalStatSync);

      monitor.stop();
      expect(fs.statSync).to.equal(originalStatSync);
    });
  });
});
