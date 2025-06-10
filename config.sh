echo "Let's configure the docs folder......................................................................"
mkdir docs
touch docs/README.MD


echo "Let's configure the deployment folder......................................................................"
mkdir Deployment

echo "......................................................................Let's configure the Cluster folder......................................................................"
mkdir  Deployment/Cluster Deployment/Cluster/kubernetes
touch Deployment/Cluster/kubernetes/deployment.yml Deployment/Cluster/kubernetes/hpa.yml Deployment/Cluster/kubernetes/service.yml

echo "......................................................................Let's configure the Configuration Manager folder......................................................................"
mkdir ConfigurationManager   ConfigurationManager/envs
touch ConfigurationManager/envs/dev.env ConfigurationManager/envs/prod.env ConfigurationManager/envs/Jenkins.env

echo "......................................................................Let's configure the Jenkins folder......................................................................"
mkdir Jenkins Jenkins/agents Jenkins/pipelines

echo "......................................................................Let's configure the Monitoring folder......................................................................"
mkdir Monitoring Monitoring/grafana Monitoring/prometheus




echo "Let's configure the Test folder......................................................................"
mkdir Test


