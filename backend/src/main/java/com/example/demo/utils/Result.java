package com.example.demo.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This class defines the schema of the response. It is used to encapsulate data prepared by
 * the server side, this object will be serialized to JSON before sent back to the client end.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Result<T> {
    private boolean flag; // Two values: true means success, false means failure.
    private Integer code; //Status code, e.g. 200;
    private String message; // Response message
    private T data; // The response payload

    public Result(boolean flag, Integer code, String message) {
    }

}