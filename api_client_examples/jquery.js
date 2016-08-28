import jq from 'jquery'

type Request = {
  abort: () => void;
  promise: Promise;
}

function ajax (url: string, options: {}): Request {
  const xhr = jq.ajax(url, options)

  const promise = new Promise((resolve, reject) => {
    xhr
      .done(resolve)
      .fail((jqXHR, textStatus) => {
        return reject(
          JSON.parse(jqXHR.responseText).errors || {}
        )
      })
  })

  const abort = () => xhr.abort()

  return {abort, promise}
}

class ApiClient {
  basePath: string

  /**
   * Constructor
   */
  constructor (basePath: string) {
    this.basePath = basePath
  }

  fetch (path: string = ''): Request {
    return ajax(`${this.basePath}${path}`)
  }

  post (path: string = '', data): Request {
    return ajax(`${this.basePath}${path}`, {method: 'POST', data})
  }

  put (path: string = '', data): Request {
    return ajax(`${this.basePath}${path}`, {method: 'PUT', data})
  }

  del (path: string = ''): Request {
    return ajax(`${this.basePath}${path}`, {method: 'DELETE'})
  }
}

export default ApiClient