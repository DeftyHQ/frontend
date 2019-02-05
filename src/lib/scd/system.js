import * as blockchain from "./utils/blockchain";
import * as daisystem from "./utils/dai-system";
import {truncateAddress} from "./utils/helpers";
import {getWebClientProviderName} from "./utils/blockchain";


import {fromRaytoWad, toBigNumber, toWei, wdiv, toBytes32, addressToBytes32, methodSig, isAddress} from "./utils/helpers";
import Eth from 'ethjs'
const eth = new Eth(new Eth.HttpProvider('https://kovan.infura.io/v3/078596535bf243c6996d2ac196563d49'));

export class SystemStore {
  tub = {}
  web3 = null

  init = (web3, tub) => {
    this.tub.address = tub;
    this.web3 = web3;
    blockchain.loadObject(web3, "tub", tub, "tub");
    // this.setFiltersTub();
    this.setCup('0x1940a230BbB225d928266339e93237eD77F37b56')
  }

  // setMyCupsFromChain = (keepTrying = false, callbacks = [], firstLoad = false) => {
  //   if (this.rootStore.profile.proxy) {
  //     this.tub.cupsLoading = true;
  //     this.setCups("new", keepTrying, callbacks, firstLoad);
  //   } else {
  //     this.tub.cupsLoading = false;
  //   }
  // }
  //
  // setMyLegacyCupsFromChain = (callbacks = [], firstLoad = false) => {
  //   this.setCups("legacy", false, callbacks, firstLoad);
  // }

  setCup = async (lad) => {
    let promisesCups = []
    let fromBlock = 10233088 //settings.chain[this.rootStore.network.network].fromBlock
    let firstLoad = true
    promisesCups = await this.getCupsFromChain(lad, fromBlock, promisesCups, firstLoad);
  }

  getCup = (id, firstLoad = false) => {
    console.debug('getCup', id)
  }

  getCupsFromChain = (lad, fromBlock, promisesCups = [], firstLoad = false) => {

    // if (!blockchain.getProviderUseLogs()) return promisesCups;
    console.log(blockchain.objects)
    return new Promise((resolve, reject) => {
      const promisesLogs = [];
      promisesLogs.push(
        new Promise((resolve, reject) => {
          // blockchain.objects.tub.LogNewCup({lad}, {fromBlock}).get((e, r) => {
          blockchain.objects.tub.getPastEvents('LogNewCup', { filter: {lad}, fromBlock }).then((r) => {
            let e;
            if (!e) {
              for (let i = 0; i < r.length; i++) {

                const log = r[i]
                const lad = log.returnValues.lad
                const cup = parseInt(log.returnValues.cup, 16)
                promisesCups.push(this.getCup(cup, firstLoad));
              }
              resolve(true);
            } else {
              reject(e);
            }
          });
        })
      );
      promisesLogs.push(
        // new Promise((resolve, reject) => {
        //   // blockchain.objects.tub.LogNote({sig: methodSig(this.web3, "give(bytes32,address)"), bar: toBytes32(this.web3, lad)}, {fromBlock}).get((e, r) => {
        //   blockchain.objects.tub.getPastEvents(
        //     'LogNote',
        //     // {
        //     //   filter: {
        //     //     sig: methodSig(this.web3, "give(bytes32,address)"),
        //     //     bar: toBytes32(this.web3, lad)
        //     //   }
        //     // },
        //     // {sig: methodSig(this.web3, "give(bytes32,address)"), bar: toBytes32(this.web3, lad)},
        //     fromBlock
        //   ).then((r) => {
        //     let e;
        //     console.debug('Warning', r, e)
        //     debugger
        //     if (!e) {
        //       for (let i = 0; i < r.length; i++) {
        //         const log = r[i]
        //         const lad = log.returnValues.lad
        //         const cup = parseInt(log.returnValues.foo, 16)
        //         promisesCups.push(this.getCup(cup, firstLoad));
        //       }
        //       resolve(true);
        //     } else {
        //       reject(e);
        //     }
        //   });
        // })

        new Promise((resolve, reject) => {
          console.debug('tub', this.tub.address,  methodSig(this.web3, "give(bytes32,address)"))
          // this.web3.eth.getPastLogs({
          eth.getLogs({
            address: this.tub.address,
            fromBlock: `${fromBlock}`,
            toBlock: 'latest',
            topics: [
              methodSig(this.web3, "give(bytes32,address)"),
              null
              // toBytes32(this.web3, lad)
            ]
          }).then(r => {
            console.debug(r)
            resolve(true)
          })
          .catch(reject)
        })
      );
      Promise.all(promisesLogs).then(() => resolve(promisesCups), e => reject(e));
    });
  }
}
