import { PathsLpAuth } from "./swagger";

type SwaggerInterface = PathsLpAuth;

type ReturnDataType = { code: number; data: any; message: string };
type ReturnData<T extends ReturnDataType | any> = T extends ReturnDataType ? T["data"] : T;

export type UrlKey = keyof SwaggerInterface;
export type MethodKey<U extends UrlKey> = string & keyof SwaggerInterface[U];

type SwaggerInterfaceSingle<U extends UrlKey, M extends MethodKey<U>> = SwaggerInterface[U][M];
type SwaggerField<U extends UrlKey, M extends MethodKey<U>> = keyof SwaggerInterfaceSingle<U, M>;
type SwaggerFieldType<U extends UrlKey, M extends MethodKey<U>, F extends SwaggerField<U, M>> = SwaggerInterfaceSingle<U, M>[F];

export type Param<U extends UrlKey, M extends MethodKey<U>> = SwaggerFieldType<U, M, "param" & SwaggerField<U, M>>;
export type Response<U extends UrlKey, M extends MethodKey<U>> = ReturnData<SwaggerFieldType<U, M, "response" & SwaggerField<U, M>>>;

export function customFetch<U extends UrlKey, M extends MethodKey<U>>(url: U, method: M, params?: Param<U, M>): Promise<Response<U, M>> {
  // custome code
  return "" as any;
}

async function test() {
  const aaa = await customFetch("/role/list", "get");

  aaa["list"];
}
