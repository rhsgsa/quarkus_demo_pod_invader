## How to use this demo

1. Define the variable for api server and token

```
API_ADDR=$(oc whoami --show-server)
TOKEN=$(oc whoami --show-token)
NAMESPACE=<target namespace>
```

2. Deploy the application
```
oc process -f openshift/pod-invader-template.yaml -p user=anyname -p password=anypassword -p token=$TOKEN -p api_url=API_ADDR -p namespace=$NAMESPACE
```

3. Install watch for Mac (optional)
```
brew install watch
```

4. Start watching in new terminal
```
watch kubectl get pods --field-selector=status.phase=Running
```

5. Open the page in browser and start killing pods and watch them crash in kubernetes

   

## How to start development

```
mvn compile quarkus:dev
```

## How to package

```
./mvnw package -Pnative -Dquarkus.native.container-build=true -Dquarkus.native.container-runtime=docker -DskipTests -Dquarkus.container-image.build=true
```
