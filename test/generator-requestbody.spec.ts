import { generatorRequestBodyType } from "../src/generator";

describe("generate RequestBody", () => {
    test("generate RequestBody1", async () => {
        const str = await generatorRequestBodyType({
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["password", "username"],
                        properties: { password: { type: "string", description: "密码" }, username: { type: "string", description: "用户名" } },
                        title: "UmsAdminLoginParam"
                    }
                }
            },
            description: "updatePasswordParam",
            required: true
        });

        expect(str).toEqual(`
/**
 * @description updatePasswordParam
 **/
body: {
/**
 * @description 密码
 **/
password: string;

/**
 * @description 用户名
 **/
username: string;

};
`);
    });

    test("generate RequestBody2", async () => {
        const str = generatorRequestBodyType({
            content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateAdminPasswordParam" } } },
            description: "updatePasswordParam",
            required: false
        });
        expect(str).toEqual(`
/**
 * @description updatePasswordParam
 **/
body?: ComponentsSchemasUpdateAdminPasswordParam;
`);
    });
});
