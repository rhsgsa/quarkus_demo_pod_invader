package com.redhat.rhsgsa.demo.podinvader;

import org.eclipse.microprofile.rest.client.annotation.RegisterClientHeaders;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.annotations.jaxrs.PathParam;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

@Path("/api/v1")
@RegisterRestClient
@RegisterClientHeaders(AuthHeaderFactory.class)
public interface ApiService {

    @GET
    @Path("/namespaces/{namespace}/pods")
    V1PodList getPods(@PathParam String namespace,@QueryParam("fieldSelector") String fieldSelector);
    //?fieldSelector=status.phase%3DRunning

    // @DELETE
    // @Path("/namespaces/{namespace}/pods/{name}")
    // void getPods(@PathParam String namespace, @PathParam String name);
}