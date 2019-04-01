# boot-angular-gateway

This repo shows how to setup a project to use SpringBoot for implementing an API 
and Angular for the frontend without affecting the workflow of the backend 
springboot developer or the frontend angular developer. 

There are three projects in this repo
* `backend` contains the SpringBoot backend api that will run on port `8080`
* `frontend` contains the angular frontend that will run on port `4200` via `ng serve'
* `gateway` spring cloud gateway running on port `7777` 

There is no CORS configured between the Boot api and the Angular front end.

The workflow is the following.
* Launch the SpringBoot api
* Launch the angular front end via `ng serve`
* Launch the gateway 

Visit `http://localhost:7777` and you will be able to interact with the 
angular app or the api. In development mode the `ng serve` uses a 
web socket so that anytime the angular app changes the page in the browser
is reloaded. Spring Cloud Gateway can proxy WebSockets there is no impact 
to the Angular developer's workflow what works on port `4200` works the same
on port `7777` 

## How it works.

The gateway's `application.yml` has two settings `app.angular` that should have
the url to the angular app and `app.api` that should have the url to 
the SpringBoot backend. 

`application.yml` settings shown below

```yaml
app:
  angular: "http://localhost:4200"
  api: "http://localhost:8080"
```

The code below shows how the gateway is configured we simply proxy anything starting 
`/api` to the boot application which should have it's api's offered up under the `/api` path
any other paths are sent to the angular application. 

```java
@Configuration
public class GatewayConfigurer {

    @Value("${app.angular}")
    private String frontend = "";

    @Value("${app.api}")
    private String api = "";

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {

        if(frontend.isEmpty() || api.isEmpty()) {
            throw new IllegalStateException("front end and backed urls not configured in application.yml");
        }

        return builder.routes()
                .route("api", r -> r.path("/api/**").uri(api))
                .route("angular", r -> r.path("/**").uri(frontend))
                .build();
    }
}
```

Spring Cloud Gateway has many  features that are very powerful which we are not used in this demo. 
Highly recommend watching [Living on the Edge with Spring Cloud Gateway](https://www.youtube.com/watch?v=jOawuL1Xnwo)
to get an overview of the interesting ways that you can use Spring Cloud Gateway in your project.

## Deploying to Cloud Foundry

### apps.internal domain 

Cloud Foundry offers a container-to-container network typically via the `apps.internal` domain 
applications deployed with a route on `apps.internal` will not be accessible from outside of 
Cloud Foundry they can only be called by other apps on Cloud Foundry.

By default apps running on CF are not allowed to open outbound network connections to other apps
and so to enable one app to call anther we will need a network policy to make that possible. 

In our case we want the `gateway` to be able to call the `backend` and the `frontend` so we need
to execute the following commands after we do a `cf push`

```bash
cf add-network-policy gateway --destination-app frontend --protocol tcp --port 8080
cf add-network-policy gateway --destination-app backend --protocol tcp --port 8080
``` 

Calls on the internal container-to-container network do not do flow through the `gorouter`
therefore the caller must do client side load balancing. For example if we `cf scale backend -i 2`
then ssh into the `gateway` container and try and resolve the ip addresses of the backend 
api we will get multiple A records as shown below.

```text
→ cf ssh gateway
vcap@c7390b9a-b7d0-48a2-7f86-ffb2:~$ nslookup adib-boot-api.apps.internal
Server:		169.254.0.2
Address:	169.254.0.2#53

Name:	adib-boot-api.apps.internal
Address: 10.252.62.158
Name:	adib-boot-api.apps.internal
Address: 10.244.176.18
```

### deploying to Cloud Foundry 

1. Run `./mvnw clean package` to build the backend / frontend and gateway
2. edit the 'manifest.yml' to pick hostnames that are available on your Cloud Foundry Foundation
3. run `deploy.sh` script  

## Issues 

* There is no security applied to the boot api or the front end. There is another repo that 
demonstrates how to do this. 
