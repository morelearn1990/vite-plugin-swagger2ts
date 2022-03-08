import { generatorSchemaType } from "../src/generator";

describe("generate schema", () => {
    test("generate number", async () => {
        const str = await generatorSchemaType("adminCount", { type: "integer", format: "int32", description: "后台用户数量" });

        expect(str).toEqual(`
/**
 * @description 后台用户数量
 * @format int32
 **/
adminCount: number;
`);
    });

    test("generate string", async () => {
        const str = await generatorSchemaType("createTime", { type: "string", description: "创建时间" });

        expect(str).toEqual(`
/**
 * @description 创建时间
 **/
createTime: string;
`);
    });

    test("generate any1", async () => {
        const str = await generatorSchemaType("anyType", {});

        expect(str).toEqual(`
anyType: any;
`);
    });

    test("generate any2", async () => {
        const str = await generatorSchemaType("anyType", true);

        expect(str).toEqual(`
anyType: any;
`);
    });

    test("generate any3", async () => {
        const str = await generatorSchemaType("anyType", undefined, { isRoot: false, isRequired: false });

        expect(str).toEqual(`
anyType?: any;
`);
    });

    test("generate enum", async () => {
        const str = await generatorSchemaType("enum", { description: "enum", enum: ["date", "boolean"] });

        expect(str).toEqual(`
/**
 * @description enum
 **/
enum: "date" | "boolean";
`);
    });

    test("generate properties", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            properties: {
                pageNum: { type: "integer", format: "int32", description: "当前页码" },
                pageSize: { type: "integer", format: "int32", description: "每页显示数" },
                total: { type: "integer", format: "int64", description: "总数记录数" },
                totalPage: { type: "integer", format: "int32", description: "总页数" }
            },
            title: "分页数据封装类«菜单»"
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«菜单»
 **/
properties: {
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
`);
    });

    test("generate additionalProperties", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            additionalProperties: {
                type: "object",
                title: "分页数据封装类«菜单»",
                properties: {
                    pageNum: { type: "integer", format: "int32", description: "当前页码" },
                    pageSize: { type: "integer", format: "int32", description: "每页显示数" },
                    total: { type: "integer", format: "int64", description: "总数记录数" },
                    totalPage: { type: "integer", format: "int32", description: "总页数" }
                }
            },
            title: "分页数据封装类«菜单»"
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«菜单»
 **/
properties: {
/**
 * @title 分页数据封装类«菜单»
 **/
[x: string | number]: {
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

};
`);
    });

    test("generate items single", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            title: "分页数据封装类«数字»",
            items: {
                type: "integer",
                description: "数字数组"
            }
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«数字»
 **/
properties: number[];
`);
    });

    test("generate items", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            title: "分页数据封装类«用户»",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer", description: "id" },
                    name: { type: "string", description: "姓名" }
                }
            }
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«用户»
 **/
properties: {
/**
 * @description id
 **/
id: number;

/**
 * @description 姓名
 **/
name: string;

}[];
`);
    });

    test("generate oneOf", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            title: "分页数据封装类«oneOf»",
            oneOf: [
                {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "id" },
                        name: { type: "string", description: "姓名1" }
                    }
                },
                {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "id" },
                        username: { type: "string", description: "姓名2" }
                    }
                }
            ]
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«oneOf»
 **/
properties: {
/**
 * @description id
 **/
id: number;

/**
 * @description 姓名1
 **/
name: string;

} | {
/**
 * @description id
 **/
id: number;

/**
 * @description 姓名2
 **/
username: string;

};
`);
    });

    test("generate oneOf string number", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            title: "分页数据封装类«oneOf string number»",
            oneOf: [{ type: "number" }, { type: "string" }]
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«oneOf string number»
 **/
properties: number | string;
`);
    });

    test("generate allOf", async () => {
        const str = await generatorSchemaType("properties", {
            type: "object",
            title: "分页数据封装类«allOf»",
            allOf: [
                {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "id" },
                        name: { type: "string", description: "姓名1" }
                    }
                },
                {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "id" },
                        username: { type: "string", description: "姓名2" }
                    }
                }
            ]
        });

        expect(str).toEqual(`
/**
 * @title 分页数据封装类«allOf»
 **/
properties: {
/**
 * @description id
 **/
id: number;

/**
 * @description 姓名1
 **/
name: string;

} & {
/**
 * @description id
 **/
id: number;

/**
 * @description 姓名2
 **/
username: string;

};
`);
    });

    test("generate ref", async () => {
        const str = await generatorSchemaType("data", { $ref: "#/components/schemas/_8" });

        expect(str).toEqual(`
/**
 **/
data: ComponentsSchemas_8;
`);
    });

    test("generate", async () => {
        const str = await generatorSchemaType("CommonResult_List_4", {
            type: "object",
            properties: { code: { type: "integer", format: "int64" }, data: { type: "array", items: { $ref: "#/components/schemas/_11" } }, message: { type: "string" } },
            title: "CommonResult«List«角色»»"
        });

        expect(str).toEqual(`
/**
 * @title CommonResult«List«角色»»
 **/
CommonResult_List_4: {
/**
 * @format int64
 **/
code: number;

/**
 **/
data: ComponentsSchemas_11[];

/**
 **/
message: string;

};
`);
    });

    test("generate ref recursion", async () => {
        const str = await generatorSchemaType(
            "ComponentsSchemas5",
            {
                type: "object",
                properties: {
                    children: { type: "array", description: "子级菜单", items: { $ref: "#/components/schemas/_5" } },
                    createTime: { type: "string", format: "date-time", description: "创建时间" },
                    hidden: { type: "integer", format: "int32", description: "前端隐藏" },
                    icon: { type: "string", description: "前端图标" },
                    id: { type: "integer", format: "int64", description: "菜单ID" },
                    level: { type: "integer", format: "int32", description: "菜单级数" },
                    name: { type: "string", description: "前端名称" },
                    parentId: { type: "integer", format: "int64", description: "父级ID" },
                    sort: { type: "integer", format: "int32", description: "菜单排序" },
                    title: { type: "string", description: "菜单名称" }
                },
                title: "后台菜单节点封装"
            },

            { isRoot: true }
        );

        expect(str).toEqual(`
/**
 * @title 后台菜单节点封装
 **/
type ComponentsSchemas5 = {
/**
 * @description 子级菜单
 **/
children: ComponentsSchemas_5[];

/**
 * @description 创建时间
 * @format date-time
 **/
createTime: string;

/**
 * @description 前端隐藏
 * @format int32
 **/
hidden: number;

/**
 * @description 前端图标
 **/
icon: string;

/**
 * @description 菜单ID
 * @format int64
 **/
id: number;

/**
 * @description 菜单级数
 * @format int32
 **/
level: number;

/**
 * @description 前端名称
 **/
name: string;

/**
 * @description 父级ID
 * @format int64
 **/
parentId: number;

/**
 * @description 菜单排序
 * @format int32
 **/
sort: number;

/**
 * @description 菜单名称
 **/
title: string;

};
`);
    });
});
