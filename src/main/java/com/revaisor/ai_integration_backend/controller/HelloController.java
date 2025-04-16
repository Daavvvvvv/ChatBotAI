package com.revaisor.ai_integration_backend.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String helloWorld(){
        return "Hello world!";
    }

    @GetMapping("/error")
    public String error(){
        return "test";
    }

    @GetMapping
    public String hola(){
        return "hola";
    }



}
