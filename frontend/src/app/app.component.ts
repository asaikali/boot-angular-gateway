import { Component } from '@angular/core';
import { HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  message = 'Api has not been called yet';


  constructor(private httpClient: HttpClient){}

  greet(){
    this.httpClient.get( "http://localhost:8080/api/hello").subscribe( (res : any) => {
      console.log(res.message);
      this.message = res.message;
    });
  }
}
