package com.redhat.rhsgsa.demo.podinvader;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class MyHostnameVerifier implements HostnameVerifier{

    @Override
    public boolean verify(String hostname, SSLSession session) {
        return true;
    }
    
    
}
