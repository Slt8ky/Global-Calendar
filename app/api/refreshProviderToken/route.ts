import axios from "axios";

export async function POST(request: Request) {
    const { provider_refresh_token } = await request.json();
    const { data: { access_token: new_provider_token } } = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: provider_refresh_token,
            grant_type: 'refresh_token',
        }
    });

    return Response.json(new_provider_token);
}