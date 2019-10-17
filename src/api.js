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
const expiresKey = 'spotify_auth_expires'
const accessTokenKey = 'spotfy_auth_access_token';

const state = {};

async function request(endpoint) {
  const response = await fetch(endpoint.startsWith('https://') ? endpoint : `https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${state.accessToken}`,
    },
	});
	if (response.status === 401) {
		return logIn();
	}
	return response.json();
}

export function logIn() {
    const clientId = '7e3bd48a271a4d408463315a7696c35f';
    const redirectUri = location.href;

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
  }

  export async function initToken() {
    const params = getHashParams();

		// const accessToken = params.access_token;
		// const expiresIn = params.expires_in;

		if (params.state && localStorage.getItem(stateKey) !== params.state) {
			throw new Error('State key check failed')
		}

		// If new token fetched
		if (params.access_token) {
			localStorage.setItem(accessTokenKey, params.access_token);
			state.accessToken = params.access_token
			localStorage.setItem(expiresKey, (state.expires_in * 1000) + Date.now());
			location.hash = ''
			return;
		}

		const accessToken = localStorage.getItem(accessTokenKey)
		const expires = localStorage.getItem(expiresKey)
		state.accessToken = accessToken;

		// If token expired
		if (!accessToken || expires > Date.now()) {
			logIn();
		}
	}

	export async function initUser() {
		const userResponse = await request('me');
		const user = {
			id: userResponse.id,
			displayName: userResponse.display_name,
			email: userResponse.email,
			image: userResponse.images[0].url,
			profileUrl: userResponse.external_urls.spotify
		}
		state.user = user;
		
		return user;
	}
	
  export async function getPlaylists() {
    const response = await request(`users/${state.user.id}/playlists`);
    return response.items;
  }

  export async function getTracks(playlistId, progressCallback) {
    const tracksUrl = `users/${state.user.id}/playlists/${playlistId}/tracks`;

    async function getPage(tracks, url) {
			const { next, limit, items, offset, total } = await request(url);

			if (next) {
        progressCallback(offset + limit, total);
        return getPage([...tracks, ...items], next);
      }
      return [...tracks, ...items];
    }

    return getPage([], tracksUrl);
  }
