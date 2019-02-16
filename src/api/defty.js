import { promisify } from 'es6-promisify'
import web3 from 'api/web3'
import * as settings from 'api/settings.json';
import * as blockchain from 'api/blockchain';
import {
  toBigNumber,
  toBytes32,
  methodSig,
  addressToBytes32,
} from 'utils/helpers';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check every second if transation is mined or not, once it is mined we'll leave the loop
async function getTransactionReceipt(hash) {
  const getReceipt = promisify(web3.eth.getTransactionReceipt)
  let receipt = null;
  while (receipt === null) {
    receipt = await getReceipt(hash);
    await sleep(1000);
  }
  return receipt;
};

export function proveOwnership(cup, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.proveOwnership.sendTransaction)(
      toBytes32(cup),
      tx
  )
}

export function proveProxyOwnership(cup, proxy, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.proveProxyOwnership.sendTransaction)(
      toBytes32(cup),
      proxy,
      tx)
}

export function transferOwnership(cup, from) {
  const defty = blockchain.objects.deftyWrap.address
  const contract = blockchain.objects.tub
  const tx = { from, value: 0 }
  return promisify(contract.give.sendTransaction)(
      toBytes32(cup),
      defty,
      tx)
}

// User's DSProxy calls SaiProxy which calls Tub
export function transferProxyOwnership(cupId, proxy, from) {
  blockchain.loadObject("dsproxy", proxy, "proxy")
  const contract = blockchain.objects.proxy
  const defty = blockchain.objects.deftyWrap
  const saiProxy = blockchain.objects.saiProxyCreateAndExecute
  const tub = blockchain.objects.tub
  if (!contract || !defty || !tub || !saiProxy) return console.error('transferProxyOwnership: Failed to load Contracts')

  const tx = { from, value: 0 }
  const newOwner = defty.address
  const action = `${methodSig(`give(address,bytes32,address)`)}${addressToBytes32(tub.address, false)}${toBytes32(cupId, false)}${addressToBytes32(newOwner, false)}`;

  return promisify(contract.execute.sendTransaction)(
      saiProxy.address,
      action,
      tx)
}

export function wrap(cup, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.wrap.sendTransaction)(
      toBytes32(cup),
      tx)
}

export function unwrap(nft, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.unwrap.sendTransaction)(nft, tx)
}

export function unwrapToProxy(nftId, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.unwrapToProxy.sendTransaction)(
      nftId,
      tx)
}

export function getNFT(address, index = 0, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.tokenOfOwnerByIndex.call)(
      address,
      toBigNumber(index),
      tx)
}

export function getNFTs(address, from) {
  const promisesNFTs = [ ...Array(10).keys() ]
    .map(index => getNFT(address, index, from))
  return Promise.all(promisesNFTs)
}

export function getCupByToken(nftId, from) {
  const contract = blockchain.objects.deftyWrap
  const tx = { from, value: 0 }
  return promisify(contract.getCupId.call)(toBigNumber(nftId), tx)
}
