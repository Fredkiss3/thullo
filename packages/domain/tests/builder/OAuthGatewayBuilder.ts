import { OAuthGateway } from '../../src/lib/OAuthGateway';
import { OAuthResult, UserInfo } from '../../src/lib/types';

export class OAuthGatewayBuilder {
    private getUserInfo: (
        accessToken: string,
        idToken: string
    ) => Promise<UserInfo | null> = () => Promise.resolve(null);
    private getAccessToken: (authCode: string) => Promise<OAuthResult | null> =
        () => Promise.resolve(null);

    public withGetUserInfo(
        getUserInfo: (
            accessToken: string,
            idToken: string
        ) => Promise<UserInfo | null>
    ): OAuthGatewayBuilder {
        this.getUserInfo = getUserInfo;
        return this;
    }

    public withGetAccessToken(
        getAccessToken: (authCode: string) => Promise<OAuthResult | null>
    ): OAuthGatewayBuilder {
        this.getAccessToken = getAccessToken;
        return this;
    }

    build(): OAuthGateway {
        return {
            getUserInfo: this.getUserInfo,
            getAccessToken: this.getAccessToken
        };
    }
}
