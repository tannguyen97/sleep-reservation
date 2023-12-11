```bash
# create key
$ kubectl create secret docker-registry gcr-json-key --docker-server=asia-southeast1-docker.pkg.dev --docker-username=_json_key --docker-password="$(cat ./ageless-airship-404212-694e10992fbf.json)" --docker-email=tannguyen090697@gmail.com
# add key to service account
$ kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'
```