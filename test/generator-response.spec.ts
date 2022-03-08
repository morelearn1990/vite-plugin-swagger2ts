import { generatorResponseBodyType } from "../src/generator";

describe("generate Response", () => {
    test("generate Response", async () => {
        const str = await generatorResponseBodyType({ description: "OK", content: { "*/*": { schema: { $ref: "#/components/schemas/CommonResult_6" } } } });
        expect(str).toEqual(`
/**
 * @description OK
 **/
response: ComponentsSchemasCommonResult_6;
`);
    });
});
