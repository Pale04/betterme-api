const sendMail = jest.fn().mockResolvedValue({ messageId: 'TEST-MSG' });
module.exports = {
  createTransport: jest.fn().mockReturnValue({ sendMail })
};