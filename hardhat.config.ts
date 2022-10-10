import '@nomicfoundation/hardhat-toolbox';
import { config } from 'dotenv';
config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    compilers: [
      {
        version: '0.4.21',
      },
      {
        version: '0.5.1',
      },
      {
        version: '0.8.7',
      },
    ],
  },
};
