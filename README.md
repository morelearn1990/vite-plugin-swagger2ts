# vite-plugin-swagger2ts

[![npm version](https://badgen.net/npm/v/vite-plugin-swagger2ts)](https://www.npmjs.com/package/vite-plugin-swagger2ts)
[![monthly downloads](https://badgen.net/npm/dm/vite-plugin-swagger2ts)](https://www.npmjs.com/package/vite-plugin-swagger2ts)
[![types](https://badgen.net/npm/types/vite-plugin-swagger2ts)](https://github.com/hannoeru/vite-plugin-swagger2ts/blob/main/src/types.ts)
[![license](https://badgen.net/npm/license/vite-plugin-swagger2ts)](https://github.com/hannoeru/vite-plugin-swagger2ts/blob/main/LICENSE)

## 使用流程

1. 安装

```sh
# npm i vite-plugin-swagger2ts -D
# or
# yarn add vite-plugin-swagger2ts -D
# or
pnpm add vite-plugin-swagger2ts -D
```

2. 配置到 `vite.config.ts`

```ts
// vite.config.ts
import ViteSwagger2ts from "vite-plugin-swagger2ts";

export default {
    plugins: [
        ViteSwagger2ts({
            swaggerUrl: "url", // swagger-resources URL
            output: "pathToSave", // not require, default './src/swagger.ts'
            prettierPath: "prettierPath", // not require, default '.prettierrc' or 'prettier.json'
            formatSchema: (schema) => {
                // not require, deal with schema. such as unwrapper common response
                if ("properties" in schema) {
                    const properties = schema["properties"];
                    if ("code" in properties && ("msg" in properties || "message" in properties) && "data" in properties) {
                        return properties["data"];
                    }
                }
                return schema;
            }
        })
    ]
};
```

## 插件流程

1. 通过配置的 url 请求 `${baseUrl}/swagger-resources` 地址，获取微服务的 resources 地址；
2. 通过 resources 地址请求 swagger 具体文档；
3. 将 swagger 接口生成具体的 typescript 类型:

```ts
interface SwaggerInterface {
    // SwaggerInterface start
    url: {
        get: {
            param: { path: { id: string }; query: { status: number }; body: { name: string } };
            reponse: { id: string; name: string; status: number };
        };
    };
}
```

4. 附加 typescrip 转换模版内容:

```ts
import { PathsSwaggerInterface } from "./swagger.ts";

export type UrlKey = keyof PathsSwaggerInterface;
export type MethodKey<U extends UrlKey> = string & keyof PathsSwaggerInterface[U];

type SwaggerInterfaceSingle<U extends UrlKey, M extends MethodKey<U>> = PathsSwaggerInterface[U][M];
type SwaggerField<U extends UrlKey, M extends MethodKey<U>> = keyof SwaggerInterfaceSingle<U, M>;
type SwaggerFieldType<U extends UrlKey, M extends MethodKey<U>, F extends SwaggerField<U, M>> = SwaggerInterfaceSingle<U, M>[F];

export type Param<U extends UrlKey, M extends MethodKey<U>> = SwaggerFieldType<U, M, "param" & SwaggerField<U, M>>;
export type Response<U extends UrlKey, M extends MethodKey<U>> = SwaggerFieldType<U, M, "response" & SwaggerField<U, M>>;
```

5. 将生成的文件保存到项目指定位置，项目通过以下代码进行使用类型提示；

```ts
import type { PathKey, MethodKey, Param, Respone } from "configfile";

export function customFetch<P extends PathKey, M extends MethodKey<P>>(path: P, method: M, params: Param<P, M>): Promise<Respone<P, M>> {
    // custome code
    return "" as any;
}
```

6. 业务代码通过引用 `customFetch` 进行使用

## License

MIT License © 2021 [morelearn1990](https://github.com/morelearn1990)
