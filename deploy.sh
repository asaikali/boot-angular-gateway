cf push
cf add-network-policy gateway --destination-app frontend --protocol tcp --port 8080
cf add-network-policy gateway --destination-app backend --protocol tcp --port 8080