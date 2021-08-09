const type = process.env.BUILD_TYPE;

let config = {};

if (type === 'lib') {
  config = {
    cjs: { type: 'babel', lazy: true },
    esm: false,
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'antd', libraryDirectory: 'lib', style: true },
        'antd',
      ],
    ],
  };
}

if (type === 'es') {
  config = {
    cjs: false,
    esm: {
      type: 'babel',
    },
    extraBabelPlugins: [
      [
        'babel-plugin-import',
        { libraryName: 'antd', libraryDirectory: 'es', style: true },
        'antd',
      ],
    ],
  };
}

export default config;
