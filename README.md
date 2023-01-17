# YoutubeAngularWebcomponent
## Tuto source:
https://buddy.works/tutorials/building-web-components-with-angular#creating-an-angular-project


## Environments
```
Angular CLI: 13.0.4
Node: 18.9.0 (Unsupported)
Package Manager: npm 8.19.1
OS: darwin x64
Angular: 13.0.3
```
## Creating an Angular Project
```
ng new youtube-angular-webcomponent
```

## Installing & Setting up Angular Elements
```
cd youtube-angular-webcomponent
npm install @angular/elements@14.2.12

```
## Creating an Angular Service
```
ng generate service data
```
We'll also be using HttpClient to send GET requests to the third-party API so we need to import HttpClientModule in our application module. Open the src/app.module.ts file and update it accordingly:
```
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { AppComponent } from './app.component';
    import { HttpClientModule } from "@angular/common/http";
    @NgModule({ 
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        HttpClientModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
```
We simply import HttpClientModule from the @angular/common/http package and add it to the imports array of the module metadata.

Next, open the src/app/data.service.ts file and update accordingly:

```
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiKey = "xxxxxxx"
  constructor(private httpClient: HttpClient) { }  
  get(){
    return this.httpClient.get(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${this.apiKey}`);
  }
}

```
We import HttpClient from the @angular/common/http package and we inject it as httpClient via the service constructor.

Note: We’ll be using a third-party API available from NewsAPI.org to retrieve news data. It offers a free plan for open source and development projects. So you first need to go to their website here (https://newsapi.org/register) to register for an API key.

## Creating an Angular Component
```
ng generate component news
```
Open the src/app/news/news.component.ts file and import the data service as follows.
We inject the service as dataService via the component constructor.
Next, let’s retrieve the news in the ngOnInit event of the component.
First, add an articles variable that will hold the news after retrieving them from the API:
```
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  articles: any;

  constructor(private dataService: DataService) { 
  }

  ngOnInit(): void {
    this.dataService.get().subscribe((data: any)=>{
      console.log(data);
      this.articles = data['articles'];
    })
  }

}
```
Next, open the src/app/news/news.component.html file and update it as follows to display the news data from the API:
```
<div *ngFor="let article of articles">
      <h2>{{article.title}}</h2>
      
        <p>
          {{article.description}}
        </p>
        <a href="{{article.url}}">Read full article</a>
    </div>
```
Let’s now test if our component is working properly. Open the src/app/app.component.html file, remove all the content and add:

```
    <app-news></app-news>
```
Go back to your terminal and run the following command to serve your app locally:
```
ng serve
```
# Transforming the Angular Component to A Web Component
Until now, we only have an Angular component that only works inside an Angular project but our goal is to transform the news component to a web component or custom element so that it can be used outside of the Angular project in any JavaScript application.

Open the src/app.module.ts file and start by adding the following imports:
```
import  { Injector} from '@angular/core';
import  { createCustomElement } from '@angular/elements';
```
Next, add NewsComponent to the bootstrap array of the module:
```
    @NgModule({ 
      declarations: [
        AppComponent,
        NewsComponent
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
      ],
      providers: [],
      bootstrap: [AppComponent , NewsComponent]
    })
    export class AppModule {
```
Next, inject `Injector` via the module constructor:

```
    export class AppModule {
      constructor(private injector: Injector) {}
    }
```
Finally, call the `createCustomElement()` method to transform the component to a custom element:

```
    export class AppModule {
      constructor(private injector: Injector) {
        const el = createCustomElement(NewsComponent, { injector });
        customElements.define('news-widget', el);
      }
      ngDoBootstrap() {}
     }
```
That’s it! This is all the required code to build a custom element from our Angular component.

## Building our Web Component
```
ng build --configuration production  --output-hashing none
```
### Fixing build error
```
⠦ Generating browser application bundles (phase: building)...node:internal/process/promises:288
            triggerUncaughtException(err, true /* fromPromise */);
            ^

HookWebpackError: Transform failed with 1 error:
error: Invalid version: "15.2-15.3"
```
Run npx browserslist in your project directory to see project's target browsers and .browserslistrc with the browserlist.
```
npx browserslist > .browserslistrc
```
## Using our Web Component
After compiling our project and getting a bunch of JavaScript files, let’s see how we can use our web component outside of Angular.

```
mkdir /tmp/wc-test
cp dist/youtube-angular-webcomponent/*.js /tmp/wc-test
vim /tmp/wc-test/index.html
```

Create an index.html file inside some folder and copy the mentioned JavaScript files from the dist folder of the Angular project in the same folder. Open the index.html file and add the following code that will be used to test if our web component works properly:
```
 <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Testing the News Web Component</title>
      <base href="/">
    </head>
    <body>
      <news-widget></news-widget>
      
        <script src="runtime.js" type="module"></script>
        <script src="polyfills.js" type="module"></script>
        <script src="main.js" type="module"></script>
    </body>
    </html>
```
We simply import the component files using a <script> tag and we call the component using the <news-widget> tag ( this is the name we specified for our custom element in the customElements.define('news-widget', el) method inside the constructor of AppModule).

Now, let’s serve this file. We’ll use the serve package from npm which provides a simple local HTTP server. Go to your terminal and run the following command to install the package:
```
npm install -g serve
```
Next, make sure you are inside the folder where you have created the index.html file and run the following command:
```
serve
```
## Concatenating the Web Component Files
To be able to use our web component, we’ll need to include the five JavaScript files which is not really convenient so the solution is to concatenate all these files into one JS file.

First, run the following command from the root of your Angular project to install the concat and fs-extra packages:
```
npm install --save-dev concat fs-extra
```
These two packages will be used to work with the file system and concatenate the files.
Inside the root of your project, create a build-component.js file and add the following code:
```
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
```
You need to make sure your put the right paths for the JavaScript files in the files array. If you didn’t name your project youtube-angular-webcomponent, the path will be different in your case depending on the name of your project.
Next, add a script to the package.json file of your Angular project as follows:
```
"scripts": {
        "build:component": "ng build --configuration production --output-hashing none && node build-component.js",  
      },
```
Finally, you can run your script to build your project and concatenate the files into one JavaScript file that can be used wherever you want to use your web component to display news. Head back to your terminal and run the following command:
```
npm run build:component
```

In the widget folder, create an index.html file and add the following content:
```
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Testing the News Web Component</title>
      <base href="/">
    </head>
    <body>
      <news-widget></news-widget>
      
      <script type="text/javascript" src="news-widget.js"></script>
    </body>
    </html>
```