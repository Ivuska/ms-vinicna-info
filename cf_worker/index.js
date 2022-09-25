addEventListener("fetch", (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { status: 500 })
      )
    );
  });


  async function handleLastIdRequest(request) {
    if (request.method==='POST') {
      const val = await request.json();
      await NOVINKY_ZE_SKOLKY.put('last_id',val.last_id);
      return new Response();
    } else if (request.method==='GET') {
      const val = await NOVINKY_ZE_SKOLKY.get('last_id',{ type: 'text' })
      return new Response(JSON.stringify({ last_id: parseInt(val) }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(null,{ status: 405 });
    }
  }

  async function handleEmailRequest(request) {
    if (request.method==='GET') {
      const val = await NOVINKY_ZE_SKOLKY.get('emails',{ type: 'text' });
      return new Response(val, {
        headers: { "Content-Type": "application/json" },
      });
    } else if (request.method==='DELETE') {
      let listOfEmails = await NOVINKY_ZE_SKOLKY.get('emails', { type: 'json' });
      const val = await request.json();
      const index = listOfEmails.indexOf(val.email);
      if (index > -1) {
        listOfEmails.splice(index, 1);
      }
      await NOVINKY_ZE_SKOLKY.put('emails', JSON.stringify(listOfEmails));
      return new Response(null,{ status: 204 });
    } else {
      return new Response(null,{ status: 405 });
    }
  }

  async function handleActivationRequest(request) {
    if (request.method ==='PUT') {
      const val = await request.json();
      const token = crypto.randomUUID();
      await NOVINKY_ZE_SKOLKY_AKTIVACE.put(token, val.email,{expirationTtl: 24*60*60})  
      return new Response(JSON.stringify({token:token}),{
        headers: { "Content-Type": "application/json" },
      })
    } else if ( request.method==='POST') {
      const val = await request.json();
      const token = val.token
      const email = await NOVINKY_ZE_SKOLKY_AKTIVACE.get(token, { type:"text" });
      if ( email === null ) {
        return new Response(null, { status: 404 })
      } 

      let listOfEmails = await NOVINKY_ZE_SKOLKY.get('emails', { type: 'json' });
      if (listOfEmails===null) {
        listOfEmails = [];
      }
      if (listOfEmails.some((elem) => elem===email)) {
        await NOVINKY_ZE_SKOLKY_AKTIVACE.delete(token)
        return new Response(null, { status: 409 });
      }
      listOfEmails.push(email);
      await NOVINKY_ZE_SKOLKY.put('emails', JSON.stringify(listOfEmails));
      await NOVINKY_ZE_SKOLKY_AKTIVACE.delete(token)
      return new Response();
    }
  }
  
  /**
   * Many more examples available at:
   *   https://developers.cloudflare.com/workers/examples
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async function handleRequest(request) {
    if (request.headers.get('X-Auth-Token') !== env.AUTH_TOKEN) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { pathname } = new URL(request.url);
  
    if (pathname==='/last_id') {
      return handleLastIdRequest(request);
    }
  
    if (pathname==='/email') {
      return handleEmailRequest(request);
    }

    if (pathname==='/activation') {
      return handleActivationRequest(request);
    }
  
  
    return new Response(null, { status: 404 })
  }