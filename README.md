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
