const fs = require('fs-extra');
const concat = require('concat');

build = async () =>{
    const files = [
        './dist/youtube-angular-webcomponent/runtime.js',
        './dist/youtube-angular-webcomponent/polyfills.js',
        './dist/youtube-angular-webcomponent/main.js'
      ];
    
      await fs.ensureDir('widget');
      await concat(files, 'widget/news-widget.js');
}
build();