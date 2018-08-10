const { sendMail } = require('./emailHelper');
const chai = require('chai');
const sinon = require('sinon');
const nodemailer = require('nodemailer');
const expect = chai.expect;

describe('#####EmailHelper', () => {
  it('sends an email', () => {
    const createTransportStub = sinon.stub(nodemailer, 'createTransport').callsFake(()=> ({
      sendMail: (options, call) => {
        call();
      }}));
    const callback = sinon.spy();
    sendMail({ to: 'someone', subject: 'something', message: 'some message'}, callback);
    expect(callback.calledOnce).to.be.true;
  });
});

