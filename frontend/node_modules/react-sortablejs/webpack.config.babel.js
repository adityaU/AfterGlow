import path from 'path';
import webpack from 'webpack';
import pkg from './package.json';

const banner = pkg.name + ' v' + pkg.version + ' | (c) ' + new Date().getFullYear() + ' ' + pkg.author + ' | ' + pkg.license + ' | ' + pkg.homepage;
const env = process.env.BUILD_ENV;
let plugins = [
    new webpack.BannerPlugin(banner)
];

if (env === 'dist') {
    plugins = plugins.concat([
        new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]);
}

export default {
    entry: path.resolve(__dirname, 'lib/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: env === 'dist' ? 'react-sortable.min.js' : 'react-sortable.js',
        libraryTarget: 'umd',
        library: 'ReactSortable'
    },
    plugins: plugins,
    externals: {
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        },
        'sortablejs': {
            root: 'Sortable',
            commonjs2: 'sortablejs',
            commonjs: 'sortablejs',
            amd: 'sortablejs'
        }
    }
};
