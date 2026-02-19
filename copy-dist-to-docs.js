const {cpSync} = require('fs');

cpSync('dist', 'docs/dist', {recursive: true});
