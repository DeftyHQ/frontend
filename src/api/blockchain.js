import { promisify } from 'es6-promisify'

import web3 from 'api/web3'
import { sleep } from 'utils/helpers'

const schema = {
  deftywrap:                require('abi/DeftyProxyWrap.json'),
  dsproxy:                  require('abi/dsproxy'),
  saiProxyCreateAndExecute: require('abi/saiProxyCreateAndExecute.json'),
  saivaluesaggregator:      require('abi/saivaluesaggregator'),
  tub:                      require('abi/saitub'),
};


export const objects = {}

export const getAccounts = () => {
  return promisify(web3.eth.getAccounts)();
}

export const loadObject = (type, address, label = null) => {
  const object = web3.eth.contract(schema[type].abi).at(address);
  console.debug(`Loading Contract ${label}`)
  if (label) {
    objects[label] = object;
  }
  return object;
}

export const setDefaultAccount = account => {
  web3.eth.defaultAccount = account;
  console.debug(`Address ${account} loaded`);
}

export const getDefaultAccount = () => {
  return typeof web3.eth.defaultAccount !== "undefined" ? web3.eth.defaultAccount : null;
}

export const getDefaultAccountByIndex = index => {
  return new Promise(async (resolve, reject) => {
    try {
      const accounts = await getAccounts();
      resolve(accounts[index]);
    } catch (e) {
      reject(new Error(e));
    }
  });
}

export const getNetwork = () => {
  return promisify(web3.version.getNetwork)();
}

export const getGasPrice = () => {
  return promisify(web3.eth.getGasPrice)();
}

export const estimateGas = (to, data, value, from) => {
  return promisify(web3.eth.estimateGas)({to, data, value, from});
}

export const getTransaction = tx => {
  return promisify(web3.eth.getTransaction)(tx);
}

// export const getTransactionReceipt = tx => {
//   return promisify(web3.eth.getTransactionReceipt)(tx);
// }

export const getTransactionReceipt = async (hash) => {
  let receipt = null;
  while (receipt === null) {
    // we are going to check every second if transation is mined or not, once it is mined we'll leave the loop
    receipt = await promisify(web3.eth.getTransactionReceipt)(hash);
    await sleep(1000);
  }
  return receipt;
};

export const getTransactionCount = address => {
  return promisify(web3.eth.getTransactionCount)(address, "pending");
}

export const getNode = () => {
  return promisify(web3.version.getNode)();
}

export const getBlock = block => {
  return promisify(web3.eth.getBlock)(block);
}

export const getBlockNumber = () => {
  return promisify(web3.eth.getBlockNumber)();
}

export const setFilter = (fromBlock, address) => {
  return promisify(web3.eth.filter)({fromBlock, address});
}

export const resetFilters = bool => {
  web3.reset(bool);
}

export const getProviderUseLogs = () => {
  return web3.useLogs;
}

export const getCurrentProviderName = () => {
  return web3.currentProvider.name;
}

export const getEthBalanceOf = addr => {
  return promisify(web3.eth.getBalance)(addr);
}

export const getTokenBalanceOf = (token, addr) => {
  return promisify(objects[token].balanceOf)(addr);
}

export const getTokenAllowance = (token, from, to) => {
  return promisify(objects[token].allowance.call)(from, to);
}

export const getTokenTrusted = (token, from, to) => {
  return promisify(objects[token].allowance.call)(from, to)
        .then((result) => result.eq(web3.toBigNumber(2).pow(256).minus(1)));
}

export const tokenApprove = (token, dst, gasPrice) => {
  return promisify(objects[token].approve)(dst, -1, {gasPrice});
}

export const getProxy = account => {
  return promisify(objects.proxyRegistry.proxies)(account.toLowerCase()).then(r => r === "0x0000000000000000000000000000000000000000" ? null : getProxyOwner(r).then(r2 => r2 === account.toLowerCase() ? r : null));
}

export const getProxyOwner = proxy => {
  return promisify(loadObject("dsproxy", proxy.toLowerCase()).owner)();
}

export const proxyExecute = (proxyAddr, targetAddr, calldata, gasPrice, value = 0) => {
  const proxyExecuteCall = loadObject("dsproxy", proxyAddr).execute["address,bytes"];
  return promisify(proxyExecuteCall)(targetAddr,calldata, {value, gasPrice});
}

export const getContractAddr = (contractFrom, contractName) => {
  return new Promise((resolve, reject) => {
    objects[contractFrom][contractName].call((e, r) => {
      if (!e) {
        if (schema[contractName]) {
          loadObject(contractName, r, contractName);
        }
        resolve(r);
      } else {
        reject(e);
      }
    });
  });
}

export const allowance = (token, srcAddr, dstAddr) => {
  return new Promise((resolve, reject) => {
    objects[token].allowance.call(srcAddr, dstAddr, (e, r) => {
      if (!e) {
        resolve(r);
      } else {
        reject(e);
      }
    });
  });
}

export const balanceOf = (token, address) => {
  return new Promise((resolve, reject) => {
    objects[token].balanceOf.call(address, (e, r) => {
      if (!e) {
        resolve(r);
      } else {
        reject(e);
      }
    });
  });
}

export const totalSupply = (token) => {
  return new Promise((resolve, reject) => {
    objects[token].totalSupply.call((e, r) => {
      if (!e) {
        resolve(r);
      } else {
        reject(e);
      }
    });
  });
}

export const sendTransaction = web3.eth.sendTransaction;

export const stopProvider = () => {
  web3.stop();
}

export const setHWProvider = (device, network, path, accountsOffset = 0, accountsLength = 1) => {
  return web3.setHWProvider(device, network, path, accountsOffset = 0, accountsLength);
}

export const setWebClientWeb3 = () => {
  return web3.setWebClientWeb3();
}

export const setWebClientProvider = provider => {
  return web3.setWebClientProvider(provider);
}

export const {getWebClientProviderName} = require("api/web3");

export const checkNetwork = (actualIsConnected, actualNetwork) => {
  return new Promise((resolve, reject) => {
    let isConnected = null;
    getNode().then(r => {
      isConnected = true;
      getBlock("latest").then(res => {
        if (res.number >= this.latestBlock) {
          resolve({
            status: 0,
            data: {
              latestBlock: res.number,
              outOfSync: ((new Date().getTime() / 1000) - res.timestamp) > 600
            }
          });
        }
      });
      // because you have another then after this.
      // The best way to handle is to return isConnect;
      return null;
    }, () => {
      isConnected = false;
    }).then(() => {
      if (actualIsConnected !== isConnected) {
        if (isConnected === true) {
          let network = false;
          getBlock(0).then(res => {
            switch (res.hash) {
              case "0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9":
                network = "kovan";
                break;
              case "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3":
                network = "main";
                break;
              default:
                console.debug("setting network to private");
                console.debug("res.hash:", res.hash);
                network = "private";
            }
            if (actualNetwork !== network) {
              resolve({
                status: 1,
                data: {
                  network: network,
                  isConnected: true,
                  latestBlock: 0
                }
              });
            }
          }, () => {
            if (actualNetwork !== network) {
              resolve({
                status: 1,
                data: {
                  network: network,
                  isConnected: true,
                  latestBlock: 0
                }
              });
            }
          });
        } else {
          resolve({
            status: 0,
            data: {
              isConnected: isConnected,
              network: false,
              latestBlock: 0
            }
          });
        }
      }
    }, e => reject(e));
  });
}
