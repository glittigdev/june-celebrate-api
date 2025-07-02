class BaseController {
  constructor() {
  }
  erroDefault(message) {
    let errorMessage = message || 'Error';
    return this.errorReponse(400, errorMessage);
  }

  errorReponse(status, message, debugMessage) {
    let err = new Error();
    err.status = status || 400;
    err.message = message || 'bad_request';
    err.debugMessage = debugMessage || '';
    return err;
  }

  middlewareResponse(status, message, data={}, debugMessage='') {
    let statusRet = status || 201;
    let messageRet = message || '';

    return {
      "status": statusRet,
      "debugMessage": debugMessage,
      "message": messageRet,
      "data": data
    };
  }

}

module.exports = BaseController;
