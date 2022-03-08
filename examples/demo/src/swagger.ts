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
  data: { [x: string | number]: any };

  /**
   **/
  message: string;
};

/**
 * @title CommonResult«分页数据封装类«角色»»
 **/
export type LpAuthComponentsSchemasCommonResult_4 = {
  /**
   * @format int64
   **/
  code: number;

  /**
   **/
  data: LpAuthComponentsSchemas_4;

  /**
   **/
  message: string;
};

/**
 * @title 分页数据封装类«角色»
 **/
export type LpAuthComponentsSchemas_4 = {
  /**
   * @description 数据集
   **/
  list: LpAuthComponentsSchemas_11[];

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
export type LpAuthComponentsSchemas_11 = {
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

export interface PathsLpAuth {
  /**
   **/
  "/role/create": {
    /**
     **/
    post: {
      param: {
        /**
         * @description role
         **/
        body: LpAuthComponentsSchemas_11;
      };
      /**
       * @description OK
       **/
      response: LpAuthComponentsSchemasCommonResult;
    };
  };

  /**
   **/
  "/role/delete": {
    /**
     **/
    post: {
      param: {
        /**
         **/
        query: {
          /**
           * @description ids
           **/
          ids: number[];
        };
      };
      /**
       * @description OK
       **/
      response: LpAuthComponentsSchemasCommonResult;
    };
  };

  /**
   **/
  "/role/list": {
    /**
     **/
    get: {
      param: {
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
      };
      /**
       * @description OK
       **/
      response: LpAuthComponentsSchemasCommonResult_4;
    };
  };

  /**
   **/
  "/role/update/{id}": {
    /**
     **/
    post: {
      param: {
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
        body: LpAuthComponentsSchemas_11;
      };
      /**
       * @description OK
       **/
      response: LpAuthComponentsSchemasCommonResult;
    };
  };
}
