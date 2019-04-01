# boot-angular-multi-module

This repo shows how to setup a project to use SpringBoot for implementing an API 
and Angular for the frontend without affecting the workflow of the backend 
springboot developer or the frontend angular developer. 

The SpringBoot api is located in the `backend` directory which follows the standard
springBoot / maven project structure and the `frontend` directory which contains
a standard angular project created via the Angular CLI.  

The workflow is the following.
* SpringBoot app runs on port 8080 and serves out the API 
* Angular app runs via `ng serve` on port `4200`
* SpringBoot app is configured to allow cross origin requests form `http://localhost:4200` which 
means that in order to view the Web App just make a request to `http://localhost:4200`

In the `frontend` directory there is a `pom.xml` file that leverages the 
maven frontend plugin. The frontend plugin does the following.
* install node and npm locally into the `frontend/target/node' folder.
* build the angular code into the standard `dist` folder 
* package up the contents on `dist/frontend` into a jar file under the path `/static` 
* spring boot backend code has a maven dependency on `frontend.jar` which means that 
when `mvn package` is executed the SpringBoot backend contains all the complied 
Angular code in the boot app and `http://localhost:8080` would serve out both the 
compiled angular code and the boot based API. 

The setup of this project makes it possible to allow the frontend developer who
knows Angular but does not know spring boot to simple run the boot from the IDE
while running `ng serve` from the command line and everything just works.

## Issues 

* There is no security setup between the Angular App and the SpringBoot Backend.

* If you would like to gradle instead of maven checkout `https://ordina-jworks.github.io/architecture/2018/10/12/spring-boot-angular-gradle.html`