package com.example.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public Message get(){


        String instanceIndex = System.getenv("CF_INSTANCE_INDEX");
        return new Message("Hello from instance '" + instanceIndex + "' the time is " +  new Date());
    }
}
