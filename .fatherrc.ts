import { visualizer } from "rollup-plugin-visualizer";
const type = process.env.BUILD_TYPE;
const ANALYZE = process.env.ANALYZE;

let config = {};

if (type === "lib") {
  config = {
    cjs: { type: "babel", lazy: true },
    esm: false,
    extraBabelPlugins: [
      [
        "babel-plugin-import",
        { libraryName: "antd", libraryDirectory: "lib", style: true },
        "antd",
      ],
    ],
  };
}

if (type === "es") {
  config = {
    cjs: false,
    esm: {
      type: "babel",
    },
    extraBabelPlugins: [
      [
        "babel-plugin-import",
        { libraryName: "antd", libraryDirectory: "es", style: true },
        "antd",
      ],
    ],
  };
}

if (ANALYZE === "1") {
  config = {
    cjs: true,
    esm: false,
    extraRollupPlugins: [visualizer({ open: true })],
  };
}

export default config;
