package com.redhat.rhsgsa.demo.podinvader;


import java.net.InetAddress;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;


@Path("/count")
public class PodCountResource {
    
    @Inject
    @RestClient
    ApiService apiService;
    
    @ConfigProperty(name = "namespace") 
    String namespace;
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PodCount count() {

        PodCount c = new PodCount();
        
        try{
            V1PodList list = apiService.getPods(namespace,"status.phase=Running");
            c.count = list.items.size();
            c.currentPodName = InetAddress.getLocalHost().getHostName();
            c.namespace = namespace;
        }catch(Exception e){
            e.printStackTrace();
        }
        return c;
    }
}
