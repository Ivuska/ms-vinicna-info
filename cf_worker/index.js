addEventListener("fetch", (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { status: 500 })
      )
    );
  });

  async function parseRequestBody(request) {
    const reader = request.body.getReader();
    const data = (await reader.read()).value;
    const decoded = new TextDecoder().decode(data);
    return JSON.parse(decoded);
  }

  async function handleLastIdRequest(request) {
    if (request.method==='POST') {
      const val = await parseRequestBody(request)
      await NOVINKY_ZE_SKOLKY.put('last_id',val.last_id);
      return new Response();
    } else if (request.method==='GET') {
      const val = await NOVINKY_ZE_SKOLKY.get('last_id',{ type: 'text' })
      return new Response(JSON.stringify({ last_id: parseInt(val) }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(null,{ status: 405 })
    }
  }

  async function handleEmailRequest(request) {
    if (request.method==='POST') {
      let listOfEmails = await NOVINKY_ZE_SKOLKY.get('emails', { type: 'json' });
      if (listOfEmails===null) {
        listOfEmails = [];
      }
      const val = await parseRequestBody(request)
      if (listOfEmails.some((elem) => elem===val.email)) {
        return new Response(null, { status: 409 })
      }
      listOfEmails.push(val.email)
      await NOVINKY_ZE_SKOLKY.put('emails', JSON.stringify(listOfEmails));
      return new Response();
    } else if (request.method==='GET') {
      const val = await NOVINKY_ZE_SKOLKY.get('emails',{ type: 'text' })
      return new Response(val, {
        headers: { "Content-Type": "application/json" },
      });
    } else if (request.method==='DELETE') {
      let listOfEmails = await NOVINKY_ZE_SKOLKY.get('emails', { type: 'json' });
      const val = await parseRequestBody(request)
      const index = listOfEmails.indexOf(val.email)
      if (index > -1) {
        listOfEmails.splice(index, 1)
      }
      await NOVINKY_ZE_SKOLKY.put('emails', JSON.stringify(listOfEmails));
      return new Response(null,{ status: 204 });
    } else {
      return new Response(null,{ status: 405 })
    }
  }
  
  /**
   * Many more examples available at:
   *   https://developers.cloudflare.com/workers/examples
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async function handleRequest(request) {
    const { pathname } = new URL(request.url);
  
    if (pathname==='/last_id') {
      return handleLastIdRequest(request);
    }
  
    if (pathname==='/email') {
      return handleEmailRequest(request);
    }
  
    return new Response(null, { status: 404 })
  }