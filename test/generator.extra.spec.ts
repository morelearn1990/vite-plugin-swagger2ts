import { OpenAPIObject } from "openapi3-ts";
import { generateDocs } from "../src/generator";
import test2 from "./json/api.test2.json";

describe("generate schema", () => {
    test("generate number", async () => {
        const str = await generateDocs(test2 as OpenAPIObject, "lp-auth");
        expect(str).toEqual(`
/**
 * @title CommonResult
 **/
export type LpAuthComponentsSchemasCommonResult = {
/**
 * @format int64
 **/
code: number;

/**
 **/
data: {[x: string | number]: any};

/**
 **/
message: string;

};

/**
 * @title Oauth2TokenDTO
 **/
export type LpAuthComponentsSchemasOauth2TokenDTO = {
/**
 * @description 有效时间（秒）
 * @format int32
 **/
expiresIn: number;

/**
 * @description 刷令牌
 **/
refreshToken: string;

/**
 * @description 访问令牌
 **/
token: string;

/**
 * @description 访问令牌头前缀
 **/
tokenHead: string;

};

/**
 * @title CommonResult«Oauth2TokenDTO»
 **/
export type LpAuthComponentsSchemasCommonResult_Oauth2TokenDTO_ = {
/**
 * @format int64
 **/
code: number;

/**
 **/
data: LpAuthComponentsSchemasOauth2TokenDTO;

/**
 **/
message: string;

};

export interface PathsLpAuth{
/**
 **/
'/oauth/logout': {
/**
 **/
get: {
param:{}
/**
 * @description OK
 **/
response: LpAuthComponentsSchemasCommonResult;
};
};

/**
 **/
'/oauth/token': {
/**
 **/
post: {
param:{
/**
 **/
body: {
/**
 * @description Oauth2客户端ID
 **/
client_id: string;

/**
 * @description Oauth2客户端秘钥
 **/
client_secret: string;

/**
 * @description 授权模式
 **/
grant_type: string;

/**
 * @description 登录密码
 **/
password?: string;

/**
 * @description 刷新token
 **/
refresh_token?: string;

/**
 * @description 登录用户名
 **/
username?: string;

};
}
/**
 * @description OK
 **/
response: LpAuthComponentsSchemasCommonResult_Oauth2TokenDTO_;
};
};

/**
 **/
'/rsa/publicKey': {
/**
 **/
get: {
param:{}
/**
 * @description OK
 **/
response: {[x: string | number]: any};
};
};
}
`);
    });
});
