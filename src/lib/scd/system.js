import * as blockchain from './utils/blockchain';
import * as daisystem from './utils/dai-system';

import * as settings from './settings.json';
import { fetchCups } from 'api';
import web3 from "./utils/web3"
import {toBigNumber, fromHex, toBytes32, methodSig} from './utils/helpers';
// import Eth from 'ethjs'
// const eth = new Eth(new Eth.HttpProvider('https://kovan.infura.io/v3/078596535bf243c6996d2ac196563d49'));

export class System {
  fromBlock = null

  constructor() {
    const network = 'kovan'
    this.fromBlock = settings.chain[network].fromBlock
    blockchain.loadObject('tub', settings.chain[network].saiTub, 'tub')
    blockchain.loadObject('saivaluesaggregator', settings.chain[network].saiValuesAggregator, 'saiValuesAggregator')
    blockchain.loadObject('deftywrap', settings.chain[network].deftyWrap, 'deftyWrap' )
  }

  // setMyCupsFromChain = (keepTrying = false, callbacks = [], firstLoad = false) => {
  //   if (this.rootStore.profile.proxy) {
  //     this.tub.cupsLoading = true;
  //     this.setCups('new', keepTrying, callbacks, firstLoad);
  //   } else {
  //     this.tub.cupsLoading = false;
  //   }
  // }
  //
  // setMyLegacyCupsFromChain = (callbacks = [], firstLoad = false) => {
  //   this.setCups('legacy', false, callbacks, firstLoad);
  // }

  setCups = async (lad) => {
    let promisesCups = await this.getCupsFromChain(lad, this.fromBlock);
    const currentLad = cup => lad.toLowerCase() === cup.cupData.lad.toLowerCase()
    Promise.all(promisesCups)
      .then(cups => cups.filter(currentLad))
      .then((cups) => {
        console.debug(cups)
      })
  }

  getCup = (id) => {
    return daisystem.getCup(id)

    // cupData: {
    //     'id': 4832,
    //     'lad': '0x909f74ffdc223586d0d30e78016e707b6f5a45e2',
    //     'safe': false,
    //     'ink': '999843601236543264',
    //     'art': '73000000000000000000',
    //     'ire': '72000547669429963994',
    //     'ratio': '1.413835616438356164',
    //     'avail_dai': '0',
    //     'avail_skr': '0',
    //     'avail_eth': '0',
    //     'liq_price': '109499999999999999997'
    //   }
  }

  getCupsFromApi = (lad, proxy) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cupIds = await fetchCups(lad, proxy)
        const promisesCups = cupIds.map(cup => this.getCup(parseInt(cup.id, 16)))
        resolve(promisesCups)
      } catch (err) {
        reject(err)
      }
    })
  }

  getCupsFromChain = (lad, promisesCups = []) => {
    const fromBlock = this.fromBlock
    // if (!blockchain.getProviderUseLogs()) return promisesCups;
    return new Promise((resolve, reject) => {
      const promisesLogs = [];
      promisesLogs.push(
        new Promise((resolve, reject) => {
          blockchain.objects.tub.LogNewCup({lad}, { fromBlock }).get((e, r) => {
            if (!e) {
              for (let i = 0; i < r.length; i++) {
                promisesCups.push(this.getCup(parseInt(r[i].args.cup, 16)));
              }
              resolve(true);
            } else {
              reject(e);
            }
          });
        })
      );
      promisesLogs.push(
        new Promise((resolve, reject) => {
          blockchain.objects.tub.LogNote({sig: methodSig('give(bytes32,address)'), bar: toBytes32(lad)}, { fromBlock }).get((e, r) => {
            if (!e) {
              for (let i = 0; i < r.length; i++) {
                promisesCups.push(this.getCup(parseInt(r[i].args.foo, 16)));
              }
              resolve(true);
            } else {
              reject(e);
            }
          });
        })
      );
      Promise.all(promisesLogs).then(() => resolve(promisesCups), e => reject(e));
    });
  }

  /*
    @TODO: move to own service
  */

  async getTransactionReceiptPromise(hash) {
    // here we just promisify getTransactionReceipt function for convenience
    return new Promise(((resolve, reject) => {
        web3.eth.getTransactionReceipt(hash, function(err, data) {
            if (err !== null) reject(err);
            else resolve(data);
        });
    }));
  }

  async getTransactionReceipt(hash) {
    let receipt = null;
    while (receipt === null) {
      // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
      receipt = await this.getTransactionReceiptPromise(hash);
      await sleep(1000);
    }
    return receipt;
  };

  transferOwnership(cup, from) {
    const defty = blockchain.objects.deftyWrap.address
    const contract = blockchain.objects.tub
    if (!contract || ! defty) return console.error('Failed to load Contracts', contract)

    const tx = { from, value: 0 }
    return new Promise(async (resolve, reject) => {
      return contract.give.sendTransaction(
          toBytes32(cup),
          defty,
          tx,
          async (err, hash) => {
            if (err) reject(err)

            const data = await this.getTransactionReceipt(hash)
            resolve(data)
          }
        )
    })
  }

  proveOwnership(cup, from) {
    const contract = blockchain.objects.deftyWrap
    if (!contract) return console.error('Failed to load DeftyWrap', contract)
    const tx = { from, value: 0 }
    return new Promise(async (resolve, reject) => {
      return contract.proveOwnership
        .sendTransaction(toBytes32(cup), tx, async (err, hash) => {
          if (err) reject(err)

          const data = await this.getTransactionReceipt(hash)
          resolve(data)
        })
    })
  }

  wrap(cup, from) {
    const contract = blockchain.objects.deftyWrap
    if (!contract) return console.error('Failed to load DeftyWrap', contract)

    const tx = { from, value: 0 }
    return new Promise(async (resolve, reject) => {
      return contract.wrap
        .sendTransaction(toBytes32(cup), tx, async (err, hash) => {
          if (err) reject(err)

          const data = await this.getTransactionReceipt(hash)
          resolve(data)
        })
    })
  }

  unwrap(nft, from) {
    const contract = blockchain.objects.deftyWrap
    if (!contract) return console.error('Failed to load DeftyWrap', contract)

    const tx = { from, value: 0 }
    return new Promise(async (resolve, reject) => {
      return contract.unwrap
        .sendTransaction(nft, tx, async (err, hash) => {
          if (err) reject(err)
          const data = await this.getTransactionReceipt(hash)
          resolve(data)
        })
    })
  }

  getNFTs(address, from) {
    const contract = blockchain.objects.deftyWrap
    if (!contract) return console.error('Failed to load DeftyWarp', contract)

    const tx = { from, value: 0 }
    return new Promise(async (resolve, reject) => {
      // @TODO:
      // iterate calls on index to retreive more than one.
      const index = 0
      return contract.tokenOfOwnerByIndex.call(
        address,
        toBigNumber(index),
        tx,
        async (err, data) => {
          if (err) reject(err)
          resolve(data)
        }
      )
    })
  }

  // receive BN
  getCupByToken(nft, from) {
    const contract = blockchain.objects.deftyWrap
    if (!contract) return console.error('Failed to load DeftyWarp', contract)

    const tx = { from, value: 0 }
    return new Promise(async (resolve, reject) => {
      // @TODO:
      // iterate calls on index to retreive more than one.
      const index = 0
      return contract.getCupId.call(
        toBigNumber(nft),
        tx,
        async (err, data) => {
          if (err) reject(err)
          resolve([ this.getCup(parseInt(data, 16)) ])
        }
      )
    })
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
