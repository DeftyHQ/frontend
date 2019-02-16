
import web3 from 'api/web3'
import * as settings from 'api/settings.json'
import * as blockchain from 'api/blockchain'
import * as daisystem from 'api/dai'
import * as deftysystem from  'api/defty'

import {
  toBigNumber,
  toBytes32,
  methodSig,
  addressToBytes32,
  sleep,
} from 'utils/helpers';

export class System {
  fromBlock = null

  constructor() {
    const network = 'kovan'
    this.fromBlock = settings.chain[network].fromBlock
    blockchain.loadObject('tub', settings.chain[network].saiTub, 'tub')
    blockchain.loadObject('saiProxyCreateAndExecute', settings.chain[network].saiProxyCreateAndExecute, 'saiProxyCreateAndExecute' )
    blockchain.loadObject('saivaluesaggregator', settings.chain[network].saiValuesAggregator, 'saiValuesAggregator')
    // blockchain.loadObject('deftywrap', settings.chain[network].deftyWrap, 'deftyWrap' )
    blockchain.loadObject('deftywrap', settings.chain[network].deftyProxyWrap, 'deftyWrap' )
  }


  async setCups(lad) {
    let promisesCups = await this.getCupsFromChain(lad, this.fromBlock);
    const currentLad = cup => lad.toLowerCase() === cup.cupData.lad.toLowerCase()
    return Promise.all(promisesCups)
      .then(cups => cups.filter(currentLad))
  }

  getCup(id) {
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

  getCupsFromApi(lad) {
    return new Promise(async (resolve, reject) => {
      try {
        const cupIds = await daisystem.fetchCups(lad)
        const promisesCups = cupIds.map(cup => this.getCup(parseInt(cup.id, 16)))
        resolve(promisesCups)
      } catch (err) {
        reject(err)
      }
    })
  }

  getCupsFromChain(lad, promisesCups = []) {
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


  // DSProxy calls SaiProxy which calls Tub
  async transferProxyOwnership(cupId, proxy, from) {
    try {
      const hash = await deftysystem.transferProxyOwnership(cupId, proxy, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  async transferOwnership(cupId, from) {
    try {
      const hash = await deftysystem.transferOwnership(cupId, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  async proveProxyOwnership(cupId, proxy, from) {
    try {
      const hash = await deftysystem.proveProxyOwnership(cupId, proxy, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  async proveOwnership(cupId, from) {
    try {
      const hash = await deftysystem.proveOwnership(cupId, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  async wrap(cupId, from) {
    try {
      const hash = await deftysystem.wrap(cupId, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  async unwrapToProxy(nftId, from) {
    try {
      const hash = await deftysystem.unwrapToProxy(nftId, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  async unwrap(nftId, from) {
    try {
      const hash = await deftysystem.unwrap(nftId, from)
      return blockchain.getTransactionReceipt(hash)
    } catch (err) {
      return err
    }
  }

  getNFTs(address, from) {
    return deftysystem.getNFTs(address, from)
  }

  async getCupByToken(nftId, from) {
    try {
      const cupId = await deftysystem.getCupByToken(nftId, from)
      return[ this.getCup(parseInt(cupId, 16)) ]
    } catch (err) {
      return err
    }
  }
}
