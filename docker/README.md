Dockerイメージの作成

このリポのルートディレクトリで
```
docker build -t image-ecr .
```

ECRへプッシュ
----
```
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin xxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com
```

```
docker tag image-ecr:latest xxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/image-ecr:latest
docker push xxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/image-ecr:latest
```

その他実験のために利用するコマンド（ENTRYPOINTとCMD）
```
docker run -d --name image-ecr -p 80:80 image-ecr
curl http://127.0.0.1/
docker exec -it image-ecr bash
```

Dockerの掃除
```
docker rmi -f $(docker images -a -q)
docker system prune
```
