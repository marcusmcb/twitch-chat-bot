const axios = require('axios')

// helper method to fetch the ngrok URL (for local testing)
const getNgrokURL = async () => {
	try {
		const response = await axios.get('http://127.0.0.1:4040/api/tunnels')
		const tunnels = response.data.tunnels
		const httpsTunnel = tunnels.find((tunnel) => tunnel.proto === 'https')
		return httpsTunnel.public_url
	} catch (error) {
		console.error('Error fetching ngrok URL:', error.message)
		throw new Error('Ngrok must be running locally')
	}
}

module.exports = getNgrokURL
