#!/bin/bash

retry=10
echo -n "Trying testing"

for i in $(seq $retry)
do
  echo -n .
  npx hardhat test --network ganache && break
  sleep 3
done

echo "testing done"
