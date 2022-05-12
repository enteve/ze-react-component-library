import type { LogicformType } from "zeroetp-api-sdk";

export type LogicformVisualizerDisplayProp = {
  schema?: boolean;
  preds?: boolean;
  query?: boolean;
  groupby?: boolean;
  sort?: boolean; // sort同时掌管着skip，sort，limit
};

export interface ZELogicformVisualizerProps {
  logicform: LogicformType; // 20211031: 应该是normed的LF。还有一些地方没有检查过

  // 表达要不要显示某一些的部分。默认都是true。可以把schema和preds关掉
  display?: LogicformVisualizerDisplayProp;
  compact?: boolean; // 除了自定义的display之外，是不是要隐藏掉分组、公式、排序、limit

  // feat: 支持筛选控件
  filters?: {
    [key: string]: {
      support_all?: boolean;
      distincts?: string[];
      show?: boolean; // 可以直接隐藏某一个filter，不显示在Visualizer上面。特殊情况用
    };
  };
  onQueryChange?: (query: any) => void;

  // feat: 设定一个统一的badgeColor
  badgeColor?: string;
}
