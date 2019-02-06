import * as blockchain from "./utils/blockchain";
import * as daisystem from "./utils/dai-system";
import {truncateAddress} from "./utils/helpers";
import {getWebClientProviderName} from "./utils/blockchain";

import * as settings from "./settings.json";
import { fetchCups } from 'api';

import {fromRaytoWad, toBigNumber, toWei, wdiv, toBytes32, addressToBytes32, methodSig, isAddress} from "./utils/helpers";
// import Eth from 'ethjs'
// const eth = new Eth(new Eth.HttpProvider('https://kovan.infura.io/v3/078596535bf243c6996d2ac196563d49'));

export class System {
  fromBlock = ""

  constructor() {
    const tub = settings.chain["kovan"].saiTub
    this.fromBlock = settings.chain["kovan"].fromBlock

    blockchain.loadObject("tub", tub, "tub")
    blockchain.loadObject("saivaluesaggregator", settings.chain["kovan"].saiValuesAggregator, "saiValuesAggregator")
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
    //     "id": 4832,
    //     "lad": "0x909f74ffdc223586d0d30e78016e707b6f5a45e2",
    //     "safe": false,
    //     "ink": "999843601236543264",
    //     "art": "73000000000000000000",
    //     "ire": "72000547669429963994",
    //     "ratio": "1.413835616438356164",
    //     "avail_dai": "0",
    //     "avail_skr": "0",
    //     "avail_eth": "0",
    //     "liq_price": "109499999999999999997"
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
          blockchain.objects.tub.LogNote({sig: methodSig("give(bytes32,address)"), bar: toBytes32(lad)}, { fromBlock }).get((e, r) => {
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

}
