# Create template file
```bash
# sample for reservations service
$ kubectl create service clusterip reservations --tcp=3000 --dry-run=client -o yaml > service.yaml
```