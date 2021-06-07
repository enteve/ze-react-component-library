# ZE React Component Library

一系列直接通过 Logicform 进行数据展示、数据交互的库

## Usage

```
yarn add ze-react-component-library
```

### Peer Dependencies

```json
{
  "@ant-design/pro-table": ">=2.38.0",
  "@ant-design/pro-provider": ">=1.4.0",
  "antd": ">=4.15.0",
  "numeral": ">=2.0.0",
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0",
  "zeroetp-api-sdk": ">=1.1.8"
}
```

## 查看每个插件的样子

```shell
yarn install
yarn run storybook
```

### 组件

- ZETable: 一个表格形式的展现

## ZETable

```tsx
import { ZETable } from "ze-react-component-library";

// 下面参数除了logicform都是可选
<ZETable
  logicform={logicform}
  preds={[]} /* 显示哪些字段 */
  titleMap={} /* pred和表格标题之间的映射关系 */
  customRender={{}} /* 自定义的render函数的Map。key为字段名称，value为render函数 */
  options={options} /* ProTable的options */
  scroll={null} /* 用来关闭默认的Scroll形态，传给ProTable的 */
  className="xx" /* Style */
/>;
```
