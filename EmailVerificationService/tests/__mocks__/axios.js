const axiosMock = {
  post : jest.fn(() =>
    Promise.resolve({ status: 201, data: { ok: true } })
  )
};

module.exports = axiosMock;