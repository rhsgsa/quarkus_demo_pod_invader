package com.redhat.rhsgsa.demo.podinvader;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.ext.ClientHeadersFactory;
import org.jboss.resteasy.specimpl.MultivaluedMapImpl;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.core.MultivaluedMap;

@ApplicationScoped
public class AuthHeaderFactory implements ClientHeadersFactory {

    @ConfigProperty(name = "accessToken") 
    String apiToken;

    @Override
    public MultivaluedMap<String, String> update(MultivaluedMap<String, String> incomingHeaders, MultivaluedMap<String, String> clientOutgoingHeaders) {
        MultivaluedMap<String, String> result = new MultivaluedMapImpl<>();
        System.out.println("Using token : " + apiToken);
        result.add("Authorization", "Bearer " + apiToken);
        return result;
    }
}