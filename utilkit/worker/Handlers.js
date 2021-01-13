function jsonHandler(data) {
  const init = {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Support CORS.
    },
  }
  const body = JSON.stringify({ data })
  return new Response(body, init)
}

function htmlHandler(html) {
  const init = {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8'
    },
  }
  return new Response(html, init)
}

// Redirect request, temporary.
function redirectHandler(url, code = 302) {
  return Response.redirect(url, code)
}

const handlers = {
  json: jsonHandler,
  html: htmlHandler,
  redirect: redirectHandler
}

export default handlers;
