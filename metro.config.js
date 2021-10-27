const { makeMetroConfig } = require('@rnx-kit/metro-config')
const { MetroSerializer, esbuildTransformerConfig } = require('@rnx-kit/metro-serializer-esbuild')

const inProduction = process.env.NODE_ENV === 'production'

module.exports = inProduction
  ? makeMetroConfig({
      projectRoot: __dirname,
      serializer: {
        customSerializer: MetroSerializer(),
      },
      transformer: esbuildTransformerConfig,
    })
  : {
      transformer: {
        getTransformOptions: async () => ({
          transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
          },
        }),
      },
    }
