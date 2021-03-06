const airbnb = require('@neutrinojs/airbnb');
const eslint = require('@conduitvc/eslint');
const { merge } = require('eslint/lib/config/config-ops');

const TS_EXTENSIONS = ['.js', '.jsx', '.mjs', '.json', '.tsx', '.ts'];

module.exports = (neutrino, { flow, typescript, ...opts } = {}) => {
  const base = eslint({ flow, typescript });
  const baseConfig = {
    extends: ['prettier/react'],
    plugins: [],
    rules: {
      // Enable anchors with react-router Link
      'jsx-a11y/anchor-is-valid': ['error', {
        components: ['Link'],
        specialLink: ['to'],
      }],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-for': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
      // handled by prettier rules
      'react/default-props-match-prop-types': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'react/jsx-handler-names': ['error', {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      }],
      'react/jsx-indent': 'off',
      'react/prefer-stateless-function': 'off',
      'react/no-access-state-in-setstate': 'off',
      'react/no-did-update-set-state': 'off',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/prop-types': ['error', {
        ignore: [
          // react-router
          'history',
          'location',
          'match',
          // material-ui
          'classes',
          'theme',
          // apollo
          'mutate',
          'data',
          'fetch',
          'refetch',
        ],
      }],
      'react/sort-comp': 'off',
    },
    settings: {},
  };

  if (typescript) {
    baseConfig.rules['react/jsx-filename-extension'] = [
      'error',
      { extensions: ['.tsx', '.ts', '.jsx', '.js'] }
    ];
    baseConfig.settings['import/resolver'] = {
      node: {
        extensions: TS_EXTENSIONS
      }
    };
    baseConfig.settings['import/extensions'] = TS_EXTENSIONS;
    baseConfig.parser = 'typescript-eslint-parser';
  }

  const airbnbDefaults = merge(base.eslint, { baseConfig });
  const options = {
    ...base,
    ...opts,
    eslint: merge(airbnbDefaults, opts.eslint || {}),
  };

  neutrino.use(airbnb, options);
};
