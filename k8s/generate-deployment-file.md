# Create template file
```bash
# sample for reservations service
$ kubectl create deployment reservations --image=asia-southeast1-docker.pkg.dev/ageless-airship-404212/reservations/production --dry-run=client -o yaml > deployment.yaml
```