/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

const stateKey = 'spotify_auth_state';

const auth = {
  logIn() {
    const clientId = '7e3bd48a271a4d408463315a7696c35f';
    const redirectUri = 'http://localhost:8080';

    const state = generateRandomString(16);

    localStorage.setItem(stateKey, state);
    const scope = 'user-read-private user-read-email';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += `&client_id=${encodeURIComponent(clientId)}`;
    url += `&scope=${encodeURIComponent(scope)}`;
    url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    url += `&state=${encodeURIComponent(state)}`;

    window.location.href = url;
  },

  async auth() {
    const params = getHashParams();

    const accessToken = params.access_token;
    const state = params.state;
    const storedSate = localStorage.getItem(stateKey);

    if (accessToken && (!state || state !== storedSate)) {
      throw new Error('Error in authentication');
    }

    localStorage.removeItem(stateKey);
    if (accessToken) {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const body = await response.json();
      console.log(body);
    }
  },
};

export default auth;
