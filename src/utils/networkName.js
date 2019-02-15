export const NETWORKS = {
  0: 'Olympic',
  1: 'Mainnet',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  42: 'Kovan Test Network',
}

export const getNetworkName = (id) => {
  return NETWORKS[id]
}
