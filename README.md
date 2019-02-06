# Backend for InMarket-appen
Kjør
`docker-compose up`
## Setup
1. Klon repoet
    ````
    git clone https://github.com/askbk/inmarket-backend.git
    ````
2. Installer Docker og docker-compose og start docker.service
    ````
    sudo pacman -S docker docker-compose
    sudo systemctl start docker.service
    ````
3. Installer dependencies
    ````
    cd inmarket-backend
    npm install
    ````
4. Kjør
    ````
    sudo docker-compose up
    ````
