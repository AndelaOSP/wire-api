const { ccdRequestBody, makeServerCall } = require('./helpers/incidents');
const { sendRequest, serverSocket } = require('./helpers/request');
const {
  validUserToken,
  invalidUserToken,
  ClientSocket,
} = require('./helpers/socket');

const clientSocket = new ClientSocket('http://wire.andela.com:3000');

console.log('>>>>>>>> clientSocket : ', clientSocket);

// const ccdRequestBody = {
//   ...testIncident,
//   ccd: [
//     {
//       userId: 'cjl6fecrb11115vf09xly2f65',
//       incidentId: 'cjfkubrlv0001tgxs3',
//     },
//   ],
// };

describe('Socket tests', () => {
  // beforeEach(done => {
  //   sendRequest('post', notesEndpoint, testPayload, (err, res) => {
  //     expect(res.body.data).toHaveProperty('id');
  //     noteId = res.body.data.id;
  //     done();
  //   });
  // });

  it('should update an incident when someone gets ccd to it', done => {
    makeServerCall(ccdRequestBody, done, 'put');
  });

  // afterEach(done => {
  //   Note.destroy({ where: { id: noteId } }).then(() => {
  //     noteId = null;
  //     done();
  //   });
  // });
});
