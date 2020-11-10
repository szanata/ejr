#!/bin/bash

docker run --rm -it \
  --network host \
  -e NPM_TOKEN=${NPM_TOKEN} \
  -v `pwd`:/app/ \
  -w /app \
    node:12.18.2-alpine /bin/sh
