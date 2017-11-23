const { NODE_ENV } = process.env;

const env = NODE_ENV === 'production' ? 'prod' : 'dev';

// const resolvePkg = require('resolve-pkg');
const webpackConfig = require(`joyent-react-scripts/config/webpack.config.${env}.js`);
const { defaultHandlers } = require('react-docgen');
const dnHandler = require('react-docgen-displayname-handler');
const path = require('path');

module.exports = {
  highlightTheme: 'base16-light',
  require: [path.join(__dirname, 'etc/style.css')],
  webpackConfig: Object.assign(webpackConfig, {
    resolve: Object.assign(webpackConfig.resolve, {
      alias: Object.assign(webpackConfig.resolve.alias, {
        'rsg-components/Wrapper': path.join(__dirname, 'src/styleguide/wrapper')
      })
    })
  }),
  title: 'UI Toolkit',
  sections: [
    {
      name: 'Get Started',
      sections: [
        {
          name: 'Overview',
          content: 'src/overview.md'
        },
        {
          name: 'Download',
          content: 'src/download.md'
        },
        {
          name: 'Contribute',
          content: 'src/contribute.md'
        },
        {
          name: 'Support',
          content: 'src/support.md'
        },
        {
          name: 'FAQ',
          content: 'src/faq.md'
        }
      ]
    },
    {
      name: 'Base',
      sections: [
        {
          name: 'Typography',
          content: 'src/text/Readme.md'
        },
        {
          name: 'Baseline',
          content: 'src/baseline/readme.md'
        },
        {
          name: 'Colors',
          content: 'src/theme/colors.md'
        },
        {
          name: 'Icons',
          content: 'src/icons/Readme.md'
        }
      ]
    },
    {
      name: 'Components',
      components: () => [
        'src/card/card.js',
        'src/table/index.js',
        'src/breadcrumb/index.js',
        'src/button/index.js',
        'src/form/checkbox.js',
        'src/header/index.js',
        'src/form/input.js',
        'src/message/index.js',
        'src/progress-bar/index.js',
        'src/popover/index.js',
        'src/form/radio.js',
        'src/section-list/index.js',
        'src/form/select.js',
        'src/form/toggle.js',
        'src/tooltip/index.js'
      ]
    }
  ],
  theme: {
    color: {
      base: '#494949',
      link: '#3B46CC',
      linkHover: '#5a62c5',
      sidebarBackground: '#1E313B'
    },
    fontSize: {
      base: 15,
      text: 15,
      small: 13,
      h1: 36,
      h2: 30,
      h3: 26,
      h4: 15,
      h5: 14,
      h6: 12
    },
    fontFamily: {
      base: ['"Libre Franklin", -apple-system, sans-serif'],
      monospace: [
        'Roboto Mono',
        'Consolas',
        '"Liberation Mono"',
        'Menlo',
        'monospace'
      ]
    },
    sidebarWidth: 300,
    spaceFactor: 6
  },
  styles: {
    Styleguide: {
      sidebar: {
        color: '#FFFFFF'
      }
    },
    Logo: {
      border: 'none',
      logo: {
        'text-indent': -999,
        'background-image': 'url("./etc/joyent-white.png")',
        'background-size': 'cover',
        width: 180,
        'background-position': 0,
        height: 39,
        padding: 0,
        margin: '0 auto'
      }
    }
  },
  handlers: componentPath =>
    defaultHandlers.concat(dnHandler.createDisplayNameHandler(componentPath))
};
