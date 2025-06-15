const axiosMock = {
  post : jest.fn(() =>
    Promise.resolve({ status: 200, data: { msg: "Verificado correctamente" } })
  )
};

module.exports = axiosMock;
