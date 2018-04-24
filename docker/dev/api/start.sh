#!/usr/bin/env bash
set -e 

npm install && npm run migrate && npm run seed
npm run start:dev
