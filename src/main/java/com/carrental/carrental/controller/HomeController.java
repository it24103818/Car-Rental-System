package com.carrental.carrental.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Car Rental System");
        model.addAttribute("welcomeMessage", "Welcome to Our Premium Car Rental Service");
        model.addAttribute("description", "Rent the perfect car for your journey with our wide selection of vehicles.");
        return "home";
    }
}