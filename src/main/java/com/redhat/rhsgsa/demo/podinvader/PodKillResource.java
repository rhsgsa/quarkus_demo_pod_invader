package com.redhat.rhsgsa.demo.podinvader;

import javax.ws.rs.POST;
import javax.ws.rs.Path;

@Path("/kill")
public class PodKillResource {

    @POST
    public void kill(){
        new Thread( new Runnable(){
            public void run(){
                //insert score to DB
                
                //suicide
                System.exit(1);
            }
        }).start();

        
    }
    
}
