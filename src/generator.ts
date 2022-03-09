import { OpenAPIObject, RequestBodyObject, ResponseObject, ReferenceObject, OperationObject, ParameterObject, SchemaObject } from "openapi3-ts";
import { getRefName, isTypeAny } from "./utils";
import { GenerateDocOption } from "./types";

export function generateDocs(input: OpenAPIObject, { docsName, baseUrl, formatSchema }: GenerateDocOption) {
    function getRefObject(ref: string) {
        return ref
            .split("/")
            .slice(1)
            .reduce((obj, item) => {
                return obj[item] || {};
            }, input);
    }

    const pathsTypeString = Object.entries(input.paths)
        .map(([endPoint, value]) => {
            const pathValue = value as OperationObject;
            const parametersExtended = pathValue.parameters;
            // 处理请求方法里面的类型
            const result = Object.entries(pathValue)
                .map(([method, options]: [string, OperationObject]) => {
                    //  不是请求方法的属性都跳过
                    if (!["get", "put", "post", "delete", "options", "head", "patch", "trace"].includes(method)) {
                        return;
                    }
                    let allParameters = [...(parametersExtended || []), ...(options.parameters || [])].map((item) => {
                        //  将 $ref 转换为正常的 ParameterObject 的对象
                        if ("$ref" in item) {
                            return getRefObject(item.$ref) as any as ParameterObject;
                        } else {
                            return item;
                        }
                    });
                    const queryParameters = allParameters.filter((item) => item.in === "query");
                    const pathParameters = allParameters.filter((item) => item.in === "path");
                    const bodyParameters = allParameters.filter((item) => !item.in);

                    // 将 $ref 转换为 requestBody 对象
                    const requestBody = options.requestBody ? ("$ref" in options.requestBody ? (getRefObject(options.requestBody.$ref) as any as RequestBodyObject) : options.requestBody) : undefined;

                    // 找到状态码为 200 或者 default 的 responses 体，并将 ReferenceObject 格式的转换为 ResponseObject；
                    let responses = Object.entries(options.responses)
                        .filter((items) => items[0] == "200" || items[0] == "default")
                        .sort()?.[0]?.[1] as ResponseObject | ReferenceObject;

                    if ("$ref" in responses) {
                        responses = getRefObject(responses.$ref) as any as ResponseObject;
                    }

                    const queryString = queryParameters.length > 0 ? jsDoc({}, { key: "query", result: `{${queryParameters.map((item) => generatorParameterType(item, docsName)).join("")}\n}` }) : "";
                    const pathString = pathParameters.length > 0 ? jsDoc({}, { key: "path", result: `{${pathParameters.map((item) => generatorParameterType(item, docsName)).join("")}\n}` }) : "";
                    const bodyExtraString = bodyParameters.length > 0 ? jsDoc({}, { key: "body", result: `{${bodyParameters.map((item) => generatorParameterType(item, docsName)).join("")}\n}` }) : "";
                    const bodyString = requestBody ? generatorRequestBodyType(requestBody, docsName) : "";
                    const responseString = generatorResponseBodyType(responses, docsName);

                    const paramString = `${queryString}${pathString}${bodyString || bodyExtraString}`;
                    return jsDoc({}, { key: method, result: `{${paramString ? `\nparam:{${paramString}}` : ""}${responseString}}` });
                })
                .join("");

            return jsDoc({}, { key: `'${baseUrl}${endPoint}'`, result: `{${result}}` });
        })
        .join("");
    const typeString = input.components?.schemas
        ? Object.entries(input.components.schemas)
              .map(([name, schema]) => {
                  if (typeof formatSchema == "function") {
                      schema = formatSchema(schema);
                  }
                  if ("$ref" in schema) {
                      schema = getRefObject(schema.$ref) as any as SchemaObject;
                  }
                  return generatorSchemaType(getRefName(`#/components/schemas/${name}`, docsName), schema, { isRoot: true, isExport: true, docsName });
              })
              .join("")
        : "";
    const apiString = `${typeString}\nexport interface Paths${getRefName(docsName)}{${pathsTypeString}}\n`;
    return apiString.replaceAll(/\n\n/g, "\n").replaceAll(/\n\n/g, "\n");
}

const TYPES = {
    integer: "number",
    number: "number",
    boolean: "boolean",
    object: "object",
    string: "string",
    array: "array"
};

interface GeneratorSchemaTypeOption {
    isRoot?: boolean;
    isRequired?: boolean;
    isExport?: boolean;
    docsName?: string;
}
export function generatorSchemaType(
    key: string,
    schema: SchemaObject | boolean | {} | undefined,
    { isRoot = false, isRequired, isExport = false, docsName = "" }: GeneratorSchemaTypeOption = {}
): string {
    if (isTypeAny(schema)) {
        return `\n${key}${isRequired === false ? "?" : ""}: any;\n`;
    }

    const { type, $ref, enum: Enum, items, properties, oneOf, additionalProperties, required, allOf } = schema as SchemaObject;
    let result = "";
    if ($ref) {
        // 引用
        result = getRefName($ref, docsName);
    } else if (Enum) {
        // 枚举
        result = `${Enum.map((t) => `"${t}"`).join(" | ")}`;
    } else if (items) {
        // 数组
        result = `${generatorSchemaType("", items, { docsName })}[]`;
    } else if (properties) {
        // 对象
        result += `{${Object.entries(properties)
            .map(([pName, _schema]) => generatorSchemaType(pName, _schema, { isRequired: !required || required.includes(pName) ? true : false, docsName }))
            .join("")}\n}`;
    } else if (oneOf) {
        // 联合类型
        result = `${oneOf.map((_schema) => `${generatorSchemaType("", _schema, { docsName })}`).join(" | ")}`;
    } else if (allOf) {
        // 交叉类型
        result = `${allOf.map((_schema) => generatorSchemaType("", _schema, { docsName })).join(" & ")}`;
    } else if (type === "object" && !result) {
        // additionalProperties
        if (additionalProperties) {
            result = `{${generatorSchemaType("[x: string | number]", additionalProperties, { docsName })}\n}`;
        } else {
            result = "{[x: string | number]: any}";
        }
    } else {
        // 基本类型，如果没有在基础类型里面默认为 string
        result = TYPES[type as keyof typeof TYPES] || "string";
    }
    if (!key) {
        return result;
    }
    return jsDoc(schema, { key, result, isExport, isRequired, isRoot });
}

export function generatorParameterType(schemas: ParameterObject, docsName?: string): string {
    const { name, required, schema, description } = schemas;
    const result = generatorSchemaType("", schema, { docsName });
    return jsDoc({ description, ...schema }, { key: name, result, isRequired: required });
}
export function generatorRequestBodyType(schemas: RequestBodyObject, docsName?: string): string {
    const { description, content, required } = schemas;
    const schema = content && Object.values(content)[0]?.["schema"];
    if (!schema) return "";
    const result = generatorSchemaType("", schema, { docsName });
    return jsDoc({ description }, { key: "body", result, isRequired: required });
}
export function generatorResponseBodyType(schemas: ResponseObject, docsName?: string): string {
    const { description, content } = schemas;
    const schema = content && Object.values(content)[0]?.["schema"];
    let result: string;
    if (!schema) {
        result = "any";
    } else {
        result = generatorSchemaType("", schema, { docsName });
    }
    return jsDoc({ description }, { key: "response", result });
}

export function jsDoc(
    { description, title, format, example, default: default1 }: any,
    { key, result, isRoot, isExport, isRequired }: { key: string; result: string; isRoot?: boolean; isExport?: boolean; isRequired?: boolean }
): string {
    const jsDoc = `\n/**\n${title ? ` * @title ${title}\n` : ""}${description ? ` * @description ${description}\n` : ""}${format ? ` * @format ${format}\n` : ""}${
        default1 ? ` * @default ${default1}\n` : ""
    }${example ? ` * @example ${example}\n` : ""} **/\n`;
    return `${jsDoc == "\n/**\n **/\n" ? "" : jsDoc}${isRoot ? `${isExport ? "export " : ""}type ${key} = ${result};\n` : `${key}${isRequired === false ? "?" : ""}: ${result};\n`}`;
}
