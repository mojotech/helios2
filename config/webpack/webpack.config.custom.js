const path = require('path');

module.exports = {
  resolve: {
    alias: {
      // reconcile with package.json jest.moduleNameMapper
      '@root': path.resolve(__dirname, '../..'),
      '@app': path.resolve(__dirname, '../../app'),
      '@javascript': path.resolve(__dirname, '../../app/javascript'),
      '@lib': path.resolve(__dirname, '../../app/javascript/lib'),
      '@components': path.resolve(__dirname, '../../app/javascript/components'),
      '@widgets': path.resolve(
        __dirname,
        '../../app/javascript/components/widgets',
      ),
      '@messages': path.resolve(
        __dirname,
        '../../app/javascript/components/widgets/messages',
      ),
      '@numbers': path.resolve(
        __dirname,
        '../../app/javascript/components/widgets/numbers',
      ),
      '@weather': path.resolve(
        __dirname,
        '../../app/javascript/components/widgets/weather',
      ),
      '@twitter': path.resolve(
        __dirname,
        '../../app/javascript/components/widgets/twitter',
      ),
      '@hocs': path.resolve(__dirname, '../../app/javascript/components/hocs'),
      '@assets': path.resolve(__dirname, '../../app/assets'),
      '@images': path.resolve(__dirname, '../../app/assets/images'),
      '@icons': path.resolve(__dirname, '../../app/assets/images/icons'),
    },
    extensions: ['.jsx', '.js'],
  },
};
