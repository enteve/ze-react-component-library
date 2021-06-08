export default {
  result: [
    {
      _id: "91310115MA1K4P939A",
      名称: "易问",
      公司全称: "上海易问数据科技有限公司",
      统一社会信用代码: "91310115MA1K4P939A",
      所在省市: {
        _id: "08614101",
        name: "郑州市",
        code: "08614101",
        Tier: "新一线城市",
        自治区: null,
      },
      联系地址: "1",
      主营业务:
        "一般项目：从事数据科技领域的技术开发、技术服务、技术咨询、技术转让；数据处理服务；计算机软硬件的开发、设计；软件开发；市场营销策划；项目策划与公关服务；咨询策划服务；广告设计、代理；广告制作；计算机软硬件及辅助设备的研发、销售。（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）",
      公司备注: "1",
      联系人: "1",
      联系人职务: "1",
      联系人电话: "1",
      联系人邮箱: "1",
      联系人备注: "1",
      开户行: "2",
      银行账号: "2",
      注册地址: "中国（上海）自由贸易试验区郭守敬路498号8幢19号楼3层",
      电话: "2",
      收件人: "3",
      收件人电话: "3",
      收件人地址: "3",
      状态: "未激活",
      合作时间: "2020-01-01",
      金额: 29.12213,
      折扣率: 0.12318,
      是否有折扣: true,
    },
  ],
  schema: {
    _id: "dealer",
    name: "经销商",
    syno: [],
    type: "entity",
    editable: true,
    show_id: false,
    properties: [
      {
        name: "名称",
        syno: ["名", "简称"],
        type: "string",
        is_name: true,
        constraints: {
          required: true,
          unique: true,
        },
        stats: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "公司全称",
        syno: ["全称"],
        type: "string",
        is_name: true,
        constraints: {
          required: true,
          unique: true,
        },
        stats: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "统一社会信用代码",
        type: "ID",
        constraints: {
          required: true,
          unique: true,
        },
        stats: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "所在省市",
        type: "object",
        ref: "geo",
        constraints: {
          required: true,
        },
        stats: {},
        primal_type: "object",
        is_comparable: false,
        schema: {
          _id: "geo",
          name: "geo",
          type: "entity",
          hierarchy: [
            {
              name: "国家",
              code_length: 3,
            },
            {
              name: "区域",
              syno: ["地区"],
              code_length: 1,
            },
            {
              name: "省市",
              syno: ["省份", "省"],
              code_length: 2,
            },
            {
              name: "城市",
              syno: ["市"],
              code_length: 2,
            },
            {
              name: "区县",
              syno: ["区", "县", "旗"],
              code_length: 2,
            },
          ],
          properties: [
            {
              name: "name",
              syno: ["名", "名称"],
              type: "string",
              is_name: true,
              stats: {},
              constraints: {},
              primal_type: "string",
              is_comparable: false,
            },
            {
              name: "code",
              type: "ID",
              stats: {},
              constraints: {
                unique: true,
                required: true,
              },
              primal_type: "string",
              is_comparable: false,
            },
            {
              name: "Tier",
              syno: ["评级"],
              type: "string",
              constraints: {
                enum: [
                  ["一线城市", "Tier1"],
                  ["新一线城市", "Tier1.5"],
                  ["二线城市", "Tier2"],
                  ["三线城市", "Tier3"],
                  ["四线城市", "Tier4"],
                  ["五线城市", "Tier5"],
                ],
              },
              stats: {
                distincts: [
                  "一线城市",
                  "新一线城市",
                  "二线城市",
                  "三线城市",
                  "四线城市",
                  "五线城市",
                ],
              },
              primal_type: "string",
              is_comparable: false,
              is_categorical: true,
            },
            {
              name: "自治区",
              type: "boolean",
              stats: {
                distincts: [true, false],
              },
              constraints: {
                enum: [true, false],
              },
              primal_type: "boolean",
              is_comparable: false,
              is_categorical: true,
            },
          ],
        },
      },
      {
        name: "联系地址",
        type: "string",
        is_name: true,
        constraints: {
          required: true,
        },
        stats: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "主营业务",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
        ui: {
          show_in_detail_only: true,
        },
      },
      {
        name: "公司备注",
        type: "text",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "联系人",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "联系人职务",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "联系人电话",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "联系人邮箱",
        type: "email",
        stats: {},
        constraints: {},
        primal_type: "email",
        is_comparable: false,
      },
      {
        name: "联系人备注",
        type: "text",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "开户行",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "银行账号",
        syno: ["银行账户"],
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "注册地址",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "电话",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "收件人",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "收件人电话",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        name: "收件人地址",
        type: "string",
        stats: {},
        constraints: {},
        primal_type: "string",
        is_comparable: false,
      },
      {
        _id: "status",
        name: "状态",
        type: "string",
        constraints: {
          enum: ["活跃", "不活跃", "休眠", "未激活"],
        },
        udf: {
          sql: "multiIf(countIf((order.`日期` >= subtractMonths(now(), 2)) AND isNotNull(order.`经销商`)) > 0, '活跃', countIf((order.`日期` >= subtractMonths(now(), 6)) AND isNotNull(order.`经销商`)) > 0, '不活跃', countIf((order.`日期` < subtractMonths(now(), 6)) AND isNotNull(order.`经销商`)) > 0, '休眠', '未激活')",
          leftJoin: {
            schema: "order",
            colname: "经销商",
          },
          dependencies: [],
        },
        stats: {
          distincts: ["活跃", "不活跃", "休眠", "未激活"],
        },
        primal_type: "string",
        is_comparable: false,
        is_categorical: true,
        is_dynamic: true,
      },
      {
        name: "合作时间",
        syno: ["合作"],
        type: "birthday",
        stats: {},
        constraints: {},
        primal_type: "date",
        is_comparable: true,
      },
    ],
  },
  columnProperties: [
    {
      name: "名称",
      syno: ["名", "简称"],
      type: "string",
      is_name: true,
      constraints: {
        required: true,
        unique: true,
      },
      stats: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "公司全称",
      syno: ["全称"],
      type: "string",
      is_name: true,
      constraints: {
        required: true,
        unique: true,
      },
      stats: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "统一社会信用代码",
      type: "ID",
      constraints: {
        required: true,
        unique: true,
      },
      stats: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "所在省市",
      type: "object",
      ref: "geo",
      constraints: {
        required: true,
      },
      stats: {},
      primal_type: "object",
      is_comparable: false,
      schema: {
        _id: "geo",
        name: "geo",
        type: "entity",
        hierarchy: [
          {
            name: "国家",
            code_length: 3,
          },
          {
            name: "区域",
            syno: ["地区"],
            code_length: 1,
          },
          {
            name: "省市",
            syno: ["省份", "省"],
            code_length: 2,
          },
          {
            name: "城市",
            syno: ["市"],
            code_length: 2,
          },
          {
            name: "区县",
            syno: ["区", "县", "旗"],
            code_length: 2,
          },
        ],
        properties: [
          {
            name: "name",
            syno: ["名", "名称"],
            type: "string",
            is_name: true,
            stats: {},
            constraints: {},
            primal_type: "string",
            is_comparable: false,
          },
          {
            name: "code",
            type: "ID",
            stats: {},
            constraints: {
              unique: true,
              required: true,
            },
            primal_type: "string",
            is_comparable: false,
          },
          {
            name: "Tier",
            syno: ["评级"],
            type: "string",
            constraints: {
              enum: [
                ["一线城市", "Tier1"],
                ["新一线城市", "Tier1.5"],
                ["二线城市", "Tier2"],
                ["三线城市", "Tier3"],
                ["四线城市", "Tier4"],
                ["五线城市", "Tier5"],
              ],
            },
            stats: {
              distincts: [
                "一线城市",
                "新一线城市",
                "二线城市",
                "三线城市",
                "四线城市",
                "五线城市",
              ],
            },
            primal_type: "string",
            is_comparable: false,
            is_categorical: true,
          },
          {
            name: "自治区",
            type: "boolean",
            stats: {
              distincts: [true, false],
            },
            constraints: {
              enum: [true, false],
            },
            primal_type: "boolean",
            is_comparable: false,
            is_categorical: true,
          },
        ],
      },
    },
    {
      name: "联系地址",
      type: "string",
      is_name: true,
      constraints: {
        required: true,
      },
      stats: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "主营业务",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "公司备注",
      type: "text",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "联系人",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "联系人职务",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "联系人电话",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "联系人邮箱",
      type: "email",
      stats: {},
      constraints: {},
      primal_type: "email",
      is_comparable: false,
    },
    {
      name: "联系人备注",
      type: "text",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "开户行",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "银行账号",
      syno: ["银行账户"],
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "注册地址",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "电话",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "收件人",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "收件人电话",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      name: "收件人地址",
      type: "string",
      stats: {},
      constraints: {},
      primal_type: "string",
      is_comparable: false,
    },
    {
      _id: "status",
      name: "状态",
      type: "string",
      constraints: {
        enum: ["活跃", "不活跃", "休眠", "未激活"],
      },
      udf: {
        sql: "multiIf(countIf((order.`日期` >= subtractMonths(now(), 2)) AND isNotNull(order.`经销商`)) > 0, '活跃', countIf((order.`日期` >= subtractMonths(now(), 6)) AND isNotNull(order.`经销商`)) > 0, '不活跃', countIf((order.`日期` < subtractMonths(now(), 6)) AND isNotNull(order.`经销商`)) > 0, '休眠', '未激活')",
        leftJoin: {
          schema: "order",
          colname: "经销商",
        },
        dependencies: [],
      },
      stats: {
        distincts: ["活跃", "不活跃", "休眠", "未激活"],
      },
      primal_type: "string",
      is_comparable: false,
      is_categorical: true,
      is_dynamic: true,
    },
    {
      name: "合作时间",
      syno: ["合作"],
      type: "birthday",
      stats: {},
      constraints: {},
      primal_type: "date",
      is_comparable: true,
    },
    {
      name: "金额",
      type: "currency",
      constraints: {},
    },
    {
      name: "折扣率",
      type: "percentage",
      primal_type: "number",
      constraints: {},
    },
    {
      name: "是否有折扣",
      type: "boolean",
      primal_type: "boolean",
      constraints: {},
    },
  ],
  total: 1,
  returnType: "table",
};
