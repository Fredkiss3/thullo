import { OAuthGateway, OAuthResult, UserInfo } from '@thullo/domain';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { container, singleton } from 'tsyringe';

interface Auth0TokenResult {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
}

interface Auth0UserInfoResult {
    email: string;
    name: string;
    nickname: string;
    picture: string;
    preferred_username?: string;
}

@singleton()
export class OAuthAdapter implements OAuthGateway {
    constructor(
        private readonly clientId: string,
        private readonly clientSecret: string,
        private readonly issuerBaseURL: string,
        private readonly redirectURI: string
    ) {}

    async getUserInfo(
        accessToken: string,
        idToken: string
    ): Promise<UserInfo | null> {
        try {
            const response: AxiosResponse<Auth0UserInfoResult> =
                await axios.get(`${this.issuerBaseURL}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            return {
                login:
                    response.data.preferred_username ?? response.data.nickname,
                email: response.data.email,
                name: response.data.name,
                avatarURL: response.data.picture
            };
        } catch (error) {
            return null;
        }
    }

    async getAccessToken(authCode: string): Promise<OAuthResult | null> {
        try {
            const response: AxiosResponse<Auth0TokenResult> = await axios.post(
                `${this.issuerBaseURL}/oauth/token`,
                `grant_type=authorization_code&client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${authCode}&redirect_uri=${this.redirectURI}/callback`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            return {
                accessToken: response.data.access_token,
                idToken: response.data.id_token
            };
        } catch (e) {
            const error: AxiosError = e as AxiosError;
            console.error(`
                Error getting access token:
                ${error.message}
            `);
            console.dir(error.response?.data);
            return null;
        }
    }
}

container.register('OAuthGateway', {
    useValue: new OAuthAdapter(
        process.env.OAUTH_CLIENT_ID!,
        process.env.OAUTH_CLIENT_SECRET!,
        process.env.ISSUER_BASE_URL!,
        process.env.OAUTH_REDIRECT_URI!
    )
});
