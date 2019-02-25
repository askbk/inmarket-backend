# Backend for InMarket-appen
## Setup
1. Klon repoet
    ````
    git clone https://github.com/askbk/inmarket-backend.git
    ````
2. Installer pakker (må fikse?)
    ````
    cd inmarket-backend
    npm install
    ````
3. Installer Docker og docker-compose og start docker.service
    ````
    sudo pacman -S docker docker-compose
    sudo systemctl start docker.service
    ````
4. Kjør
    ````
    sudo docker-compose up
    ````
## Bruk
### Gå inn i MariaDB
````
docker exec -it inmarket-backend_database_1 bash
````
