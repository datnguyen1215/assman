import chai from 'chai';
import network from '#src/common/network';

const { expect } = chai;

describe('network', () => {
  it('getInterfaces() should return a list of interfaces', () => {
    const interfaces = network.getInterfaces();
    expect(interfaces).to.exist;
    expect(interfaces.length).to.be.greaterThan(0);
    expect(interfaces[0]).to.be.a('string');
    expect(interfaces[0]).to.equal('localhost');
  });
});
