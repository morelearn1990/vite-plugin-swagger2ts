import { ParameterObject } from "openapi3-ts";
import { generatorParameterType, jsDoc } from "../src/generator";

describe("generate schema", () => {
    test("generate single1", async () => {
        const str = await generatorParameterType({ name: "urlKeyword", in: "query", description: "urlKeyword", required: false, schema: { type: "string" } });
        expect(str).toEqual(`
/**
 * @description urlKeyword
 **/
urlKeyword?: string;
`);
    });

    test("generate single2", async () => {
        const str = generatorParameterType({ name: "pageSize", in: "query", description: "pageSize", required: false, schema: { type: "integer", format: "int32", default: 5 } });
        expect(str).toEqual(`
/**
 * @description pageSize
 * @format int32
 * @default 5
 **/
pageSize?: number;
`);
    });

    test("generate arr", async () => {
        const str = ([
            { name: "pageSize", in: "query", description: "pageSize", required: false, schema: { type: "integer", format: "int32", default: 5 } },
            { name: "urlKeyword", in: "query", description: "urlKeyword", required: false, schema: { type: "string" } }
        ] as ParameterObject[])
            .map((schema) => generatorParameterType(schema, ""))
            .join("");

        expect(str).toEqual(`
/**
 * @description pageSize
 * @format int32
 * @default 5
 **/
pageSize?: number;

/**
 * @description urlKeyword
 **/
urlKeyword?: string;
`);
    });

    test("generate arr", async () => {
        const str = jsDoc(
            {},
            {
                key: "query",
                result: `{${([
                    { name: "pageSize", in: "query", description: "pageSize", required: false, schema: { type: "integer", format: "int32", default: 5 } },
                    { name: "urlKeyword", in: "query", description: "urlKeyword", required: false, schema: { type: "string" } }
                ] as ParameterObject[])
                    .map((schema) => generatorParameterType(schema, ""))
                    .join("")}\n}`
            }
        );

        expect(str).toEqual(`
/**
 **/
query: {
/**
 * @description pageSize
 * @format int32
 * @default 5
 **/
pageSize?: number;

/**
 * @description urlKeyword
 **/
urlKeyword?: string;

};
`);
    });
});
