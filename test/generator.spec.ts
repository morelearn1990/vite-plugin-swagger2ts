import { OpenAPIObject } from "openapi3-ts";
import { generateDocs } from "../src/generator";
import test1 from "./json/api.test1.json";

describe("generate schema", () => {
    test("generate test1", async () => {
        const str = await generateDocs(test1 as OpenAPIObject, "lp-admin", "/lp-admin");
        expect(str).toEqual(`
/**
 * @title CommonResult
 **/
export type LpAdminComponentsSchemasCommonResult = {
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
 * @title CommonResult«分页数据封装类«角色»»
 **/
export type LpAdminComponentsSchemasCommonResult_4 = {
/**
 * @format int64
 **/
code: number;

/**
 **/
data: LpAdminComponentsSchemas_4;

/**
 **/
message: string;

};

/**
 * @title 分页数据封装类«角色»
 **/
export type LpAdminComponentsSchemas_4 = {
/**
 * @description 数据集
 **/
list: LpAdminComponentsSchemas_11[];

/**
 * @description 当前页码
 * @format int32
 **/
pageNum: number;

/**
 * @description 每页显示数
 * @format int32
 **/
pageSize: number;

/**
 * @description 总数记录数
 * @format int64
 **/
total: number;

/**
 * @description 总页数
 * @format int32
 **/
totalPage: number;

};

/**
 * @title 角色
 **/
export type LpAdminComponentsSchemas_11 = {
/**
 * @description 后台用户数量
 * @format int32
 **/
adminCount: number;

/**
 * @description 创建时间
 * @format date-time
 **/
createTime: string;

/**
 * @description 描述
 **/
description: string;

/**
 * @description 角色id
 * @format int64
 **/
id: number;

/**
 * @description 名称
 **/
name: string;

/**
 * @format int32
 **/
sort: number;

/**
 * @description 启用状态：0->禁用；1->启用
 * @format int32
 **/
status: number;

};

export interface PathsLpAdmin{
/**
 **/
'/lp-admin/role/create': {
/**
 **/
post: {
param:{
/**
 * @description role
 **/
body: LpAdminComponentsSchemas_11;
}
/**
 * @description OK
 **/
response: LpAdminComponentsSchemasCommonResult;
};
};

/**
 **/
'/lp-admin/role/delete': {
/**
 **/
post: {
param:{
/**
 **/
query: {
/**
 * @description ids
 **/
ids: number[];

};
}
/**
 * @description OK
 **/
response: LpAdminComponentsSchemasCommonResult;
};
};

/**
 **/
'/lp-admin/role/list': {
/**
 **/
get: {
param:{
/**
 **/
query: {
/**
 * @description keyword
 **/
keyword?: string;

/**
 * @description pageNum
 * @format int32
 * @default 1
 **/
pageNum?: number;

/**
 * @description pageSize
 * @format int32
 * @default 5
 **/
pageSize?: number;

};
}
/**
 * @description OK
 **/
response: LpAdminComponentsSchemasCommonResult_4;
};
};

/**
 **/
'/lp-admin/role/update/{id}': {
/**
 **/
post: {
param:{
/**
 **/
path: {
/**
 * @description id
 * @format int64
 **/
id: number;

};

/**
 * @description role
 **/
body: LpAdminComponentsSchemas_11;
}
/**
 * @description OK
 **/
response: LpAdminComponentsSchemasCommonResult;
};
};
}
`);
    });
});
